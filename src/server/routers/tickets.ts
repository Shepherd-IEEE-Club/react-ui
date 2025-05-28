import { z } from 'zod';
import {router, procedure} from '@woco/server/trpc.ts';
import { TicketInputSchema, TicketSchema } from '@woco/schema/ticket';
import { TicketModel } from '@woco/db/models/ticket';

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
});
