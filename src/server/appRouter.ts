import {router, procedure} from './trpc';
import {z} from 'zod';
import {Sequelize} from 'sequelize';
import {PostmarkImageModel, PostmarkModel} from '@woco/db/models/postmark';
import { GetImagesInput } from '@woco/schema/postmark/image';

export const appRouter = router({
    postmarks: router({
        paged: procedure
            .input(z.object({
                page: z.number().default(1),
                start_year: z.string().optional(),
                end_year: z.string().optional(),
            }))
            .query(async ({input}) => {
                console.log('fortnite')
                const limit = 50;
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

                const rows = await PostmarkModel.findAll({where, limit, offset});
                return rows.map(r => ({
                    ...r.toJSON(),
                    image: r.image ? r.image.toString('base64') : null,
                }));
            }),


        infinite: procedure
            .input(
                z.object({
                    limit: z.number().min(1).max(100).default(50),
                    cursor: z.number().nullish(), // id of last item from client
                    startYear: z.number().optional(),
                    endYear: z.number().optional(),
                }),
            )
            .query(async ({input}) => {
                const PAGE_SIZE = input.limit;
                const where: Record<string, any> = {};

                // Optional date range
                if (input.startYear && input.endYear) {
                    where.date_seen = {
                        [Sequelize.Op.between]: [
                            `${input.startYear}-01-01`,
                            `${input.endYear}-12-31`,
                        ],
                    };
                } else if (input.startYear) {
                    where.date_seen = {[Sequelize.Op.gte]: `${input.startYear}-01-01`};
                } else if (input.endYear) {
                    where.date_seen = {[Sequelize.Op.lte]: `${input.endYear}-12-31`};
                }

                // Optional cursor (fetch rows after this id)
                if (input.cursor) {
                    where.id = {[Sequelize.Op.gt]: input.cursor};
                }

                // Main paginated query
                const rows = await PostmarkModel.findAll({
                    where,
                    order: [['id', 'ASC']],
                    limit: PAGE_SIZE + 1, // Grab one extra row to detect next page
                    attributes: ['id', 'postmark', 'town', 'state', 'date_seen'],
                    include: [{
                        model: PostmarkImageModel,
                        as: 'images',
                        attributes: ['id', 'thumbnail'],
                        separate: true, // ← optimized secondary fetch
                    }],
                });

                // Pagination logic
                let nextCursor: number | undefined = undefined;
                if (rows.length > PAGE_SIZE) {
                    const next = rows.pop(); // Remove the extra item
                    nextCursor = next!.id;
                }

                // Shape output
                return {
                    items: rows.map(r => ({
                        ...r.toJSON(),
                        imageIds: r.images.map(img => img.id),
                    })),
                    nextCursor,
                };
            }),

        getImages: procedure
            .input(GetImagesInput)
            .query(async ({ input }) => {
                const images = await PostmarkImageModel.findAll({
                    where: { id: input.ids },
                    attributes: ['id', 'data'],
                });

                return images.map(img => ({
                    id: img.id,
                    base64: img.data.toString('base64'),
                }));
            }),


    })
});

export type AppRouter = typeof appRouter;
