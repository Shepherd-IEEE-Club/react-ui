import { z } from 'zod';
import {router, procedure} from '@woco/server/trpc.ts';
import { TicketInputSchema, TicketSchema } from '@woco/schema/ticket';
import { TicketModel } from '@woco/db/models/ticket';
import {PostmarkImageModel, PostmarkModel} from '@woco/db/models/postmark.ts';
import {PostmarkSchema, PostmarkTableRowSchema} from "@woco/schema/postmark.ts";
import PostmarkModal from "@woco/web/pages/PostmarkModal";
import { Op } from 'sequelize';

function extractUniquePostmarkIds(tickets: { postmark_id: number }[]) {
    return Array.from(new Set(tickets.map(t => t.postmark_id)));
}


export const ticketsRouter = router({
    create: procedure
        .input(TicketInputSchema)
        .output(TicketSchema)
        .mutation(async ({ input }) => {
            const ticket = await TicketModel.create({
                ...input,
                status_id: input.status_id ?? 1,
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
        .input(z.object({ postmark_id: z.number() }))
        .query(async ({ input }) => {
            return await TicketModel.findAll({
                where: { postmark_id: input.postmark_id },
                order: [['created_at', 'DESC']],
            });
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
        .query(async ({ input }) => {
            const limit = input.limit;
            const cursor = input.cursor;

            const where: any = {
                user_id: input.user_id,
            };

            if (cursor) {
                where.id = { $gt: cursor }; // simple cursor pagination
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
                where: { id: { [Op.in]: uniquePostmarkIDs } },
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
                const raw = p.get({ plain: true });
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
                console.dir(validate.error.format(), { depth: null });
                throw new Error('Validation failed');
            }

            return output;
        }),
});
