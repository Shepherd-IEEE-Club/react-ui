import { router, procedure } from './trpc';
import { z } from 'zod';
import { Sequelize } from 'sequelize';
import { PostmarkModel } from '@woco/db/models/postmark';

export const appRouter = router({
    postmarks: procedure
        .input(z.object({
            page:       z.number().default(1),
            start_year: z.string().optional(),
            end_year:   z.string().optional(),
        }))
        .query(async ({ input }) => {
            console.log('fortnite')
            const limit  = 50;
            const offset = (input.page - 1) * limit;

            const where: any = {};
            if (input.start_year && input.end_year) {
                where.date_seen = {
                    [Sequelize.Op.between]: [
                        `${input.start_year}-01-01`,
                        `${input.end_year}-12-31`,
                    ],
                };
            }

            const rows = await PostmarkModel.findAll({ where, limit, offset });
            return rows.map(r => ({
                ...r.toJSON(),
                image: r.image ? r.image.toString('base64') : null,
            }));
        }),

    infinite: procedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(40),
                cursor: z.number().nullish(), // last seen ID
                startYear: z.number().optional(),
                endYear: z.number().optional(),
            })
        )
        .query(async ({ input }) => {
            const { limit, cursor, startYear, endYear } = input;

            const where: any = {};
            if (startYear) {
                where.date_seen = { [Sequelize.Op.gte]: `${startYear}-01-01` };
            }
            if (endYear) {
                where.date_seen = {
                    ...where.date_seen,
                    [Sequelize.Op.lte]: `${endYear}-12-31`,
                };
            }
            if (cursor) {
                where.id = { [Sequelize.Op.gt]: cursor };
            }

            const rows = await PostmarkModel.findAll({
                where,
                limit: limit + 1,
                order: [['id', 'ASC']],
            });

            let nextCursor: number | undefined = undefined;
            if (rows.length > limit) {
                const next = rows.pop();
                nextCursor = next!.id;
            }

            return {
                items: rows.map((r) => ({
                    ...r.toJSON(),
                    image: r.image ? r.image.toString('base64') : null,
                })),
                nextCursor,
            };
        }),

});

export type AppRouter = typeof appRouter;
