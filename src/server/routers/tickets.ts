import {z} from 'zod';
import {router, procedure} from '@woco/server/trpc.ts';
import {TicketInputSchema, TicketSchema} from '@woco/schema/ticket';
import {TicketModel} from '@woco/db/models/ticket';
import {PostmarkImageModel, PostmarkModel} from '@woco/db/models/postmark.ts';
import {FullImageSchema, PostmarkImageSchema, PostmarkSchema, PostmarkTableRowSchema} from "@woco/schema/postmark.ts";
import PostmarkModal from "@woco/web/pages/PostmarkModal";
import {Op} from 'sequelize';
import Ticket from "@woco/web/pages/Ticket";

function extractUniquePostmarkIds(tickets: { postmark_id: number }[]) {
    return Array.from(new Set(tickets.map(t => t.postmark_id)));
}


export const ticketsRouter = router({

    // Add ticket to DB
    create: procedure
        .input(TicketInputSchema)
        .output(TicketSchema)
        .mutation(async ({input}) => {
            const ticket = await TicketModel.create({
                ...input,
                status_id: input.status_id ?? 1, // always pending
                created_at: new Date(), // override to ensure consistency
            });

            return ticket.toJSON(); // assumes model fields match schema exactly
        }),


    getAll: procedure.query(async () => {
        return await TicketModel.findAll({
            order: [['created_at', 'DESC']],
        });
    }),

    byPostmark: procedure
        .input(z.object({postmark_id: z.number()}))
        .query(async ({input}) => {
            return await TicketModel.findAll({
                where: {postmark_id: input.postmark_id},
                order: [['created_at', 'DESC']],
            });
        }),

    // get images for a ticket (postmark's and changes)
    images: procedure
        .input(z.object({ticket: TicketSchema}))
        .output(z.array(PostmarkImageSchema))
        .query(async ({input}) => {
            const images = await PostmarkImageModel.findAll({
                where: {
                    [Op.or]: [
                        {ticket_id: input.ticket.id},
                        {postmark_id: input.ticket.postmark_id}

                    ]
                },

                // TODO user settable order
                order: [['id', 'ASC']],
            });

            console.log(images)

            return images.map(img => ({
                ...img.get({ plain: true }),
                data: img.data.toString('base64'),
            }));
        }),





    // paginated for future
    mine: procedure
        .input(
            z.object({
                // FIXME return all if not given limit
                limit: z.number().min(1).max(10000).default(50),
                cursor: z.number().optional(),
                user_id: z.number(), // TODO
            })
        ).output(
            z.object({
                tickets: z.array(TicketSchema),
                postmarks: z.record(PostmarkTableRowSchema),
            })
        )
        .query(async ({input}) => {
            const limit = input.limit;
            const cursor = input.cursor;

            const where: any = {
                user_id: input.user_id,
            };

            if (cursor) {
                where.id = {$gt: cursor}; // simple cursor pagination
            }


            // Get tickets
            const tickets = await TicketModel.findAll({
                where,
                limit: limit + 1,
                order: [['id', 'ASC']],
            });


            const resultTickets = tickets.map((ticket) => {
                const t = ticket.toJSON();
                return {
                    ...t,
                    // this check is because db can return json as string
                    changes: typeof t.changes === 'string' ? JSON.parse(t.changes) : t.changes,
                    created_at: new Date(t.created_at),
                };
            });


            const uniquePostmarkIDs = Array.from(new Set(tickets.map(t => t.postmark_id)));

            const foundPostmarks = await PostmarkModel.findAll({
                where: {id: {[Op.in]: uniquePostmarkIDs}},
                include: [
                    {
                        model: PostmarkImageModel,
                        as: 'images',
                        attributes: ['thumbnail'],
                        separate: true,
                        limit: 1,
                        order: [['id', 'ASC']], // or your preferred order logic
                    },
                ],
            });


            // TODO how to decide which of postmark's images is thumbnail?

            const postmarks: Record<number, z.input<typeof PostmarkTableRowSchema>> = {};

            foundPostmarks.forEach((p) => {
                const raw = p.get({plain: true});
                const images = (raw.images ?? []).map((img: any) => ({
                    id: img.id,
                    thumbnail: img.thumbnail,
                }));

                postmarks[raw.id] = {
                    ...raw,
                    // Only need 1 thumbnail
                    thumbnail: images[0]?.thumbnail ?? '', // fallback to empty string
                };
            });

            const output = {
                tickets: resultTickets,
                postmarks: postmarks,
            };

            const validate = z
                .object({
                    tickets: z.array(TicketSchema),
                    postmarks: z.record(PostmarkTableRowSchema),
                })
                .safeParse(output);

            if (!validate.success) {
                console.error('❌ Output validation failed:');
                console.dir(validate.error.format(), {depth: null});
                throw new Error('Validation failed');
            }

            return output;
        }),


    approve: procedure
        .input(z.object({
            ticket_id: z.number(),
            // TODO track approver
            // approver_id: z.number(),
        }))
        .mutation(async ({ input }) => {
            // FIXME image stuff
            const ticket = await TicketModel.findByPk(input.ticket_id);

            if (!ticket) {
                throw new Error("Ticket not found");
            }

            if (ticket.status_id !== 1) {
                throw new Error("Ticket must be pending to approve");
            }

            await ticket.update({
                status_id: 2,
                // approved_by: input.approver_id,
            });

            return ticket.toJSON();
        }),

    deny: procedure
        .input(
            TicketSchema.pick({
                id: true,
                deny_comment: true,
            })
        )
        .mutation(async ({ input, ctx }) => {
            // TODO auth
            // if (!ctx.session?.user) throw new Error("Unauthorized");

            const ticket = await TicketModel.findByPk(input.id);

            if (!ticket) {
                throw new Error("Ticket not found");
            }

            if (ticket.status_id !== 1) {
                throw new Error("Ticket must be pending");
            }
            console.log(ticket)

            await ticket.update(
                {
                    status_id: 3, // Denied
                    deny_comment: input.deny_comment,
                    // updated_by: ctx.session.user.id,
                }
            );
        }),

});
