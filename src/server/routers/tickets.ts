import { z } from 'zod';
import {router, procedure} from '@woco/server/trpc.ts';
import { TicketInputSchema, TicketSchema } from '@woco/schema/ticket';
import { TicketModel } from '@woco/db/models/ticket';
import {PostmarkImageModel, PostmarkModel} from '@woco/db/models/postmark.ts';
import {PostmarkSchema} from "@woco/schema/postmark.ts";
import PostmarkModal from "@woco/web/pages/PostmarkModal";
import { Op } from 'sequelize';

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
                postmarks: z.record(PostmarkSchema.withThumbnail),
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

            const tickets = await TicketModel.findAll({
                where,
                limit: limit + 1, // one extra to check for next page
                include: [
                    { model: PostmarkModel },
                    // { model: TicketStatusModel, as: 'status' },
                ],
                order: [['id', 'ASC']],
            });

            const hasMore = tickets.length > limit;
            const trimmed = hasMore ? tickets.slice(0, -1) : tickets;

            const resultTickets = trimmed.map((ticket) => {
                const t = ticket.toJSON();
                return {
                    ...t,
                    // this check is because db can return json as string
                    changes: typeof t.changes === 'string' ? JSON.parse(t.changes) : t.changes,
                    created_at: new Date(t.created_at),
                };
            });

            // collect unique postmarks
            const trimmedIds: number[] = trimmed.map(t => t.postmark_id);
            const uniquePostmarkIds: number[] = Array.from(new Set(trimmedIds));

            const foundPostmarks = await PostmarkModel.findAll({
                where: {
                    id: {
                        [Op.in]: uniquePostmarkIds,
                    },
                },
                // FIXME this gets every thumbnail on image
                include: [
                    {
                        model: PostmarkImageModel,
                        as: 'images',
                        attributes: ['id', 'thumbnail'],
                        // separate: true,
                    },
                ],
            });

            // FIXME
            const postmarks: Record<number, any> = {};
            foundPostmarks.forEach(p => {
                const raw = p.get();
                raw.images = raw.images?.map((img: any) => img.get());
                postmarks[p.id] = raw;

            });


            const output = {
                tickets: resultTickets,
                postmarks: postmarks,
            };

            const validate = z
                .object({
                    tickets: z.array(TicketSchema),
                    postmarks: z.record(PostmarkSchema.withThumbnail),
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
