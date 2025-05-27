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

        // infinite: procedure
        //     .input(
        //         z.object({
        //             limit: z.number().min(1).max(100).default(40),
        //             cursor: z.number().nullish(), // id of the last item the client has
        //             startYear: z.number().optional(),
        //             endYear: z.number().optional(),
        //             // add other filters here
        //         })
        //     )
        //     .query(async ({ input }) => {
        //         const { limit, cursor, startYear, endYear } = input;
        //
        //         const where: any = {};
        //         if (startYear) {
        //             where.date_seen = { [Sequelize.Op.gte]: `${startYear}-01-01` };
        //         }
        //         if (endYear) {
        //             where.date_seen = where.date_seen
        //                 ? { ...where.date_seen, [Sequelize.Op.lte]: `${endYear}-12-31` }
        //                 : { [Sequelize.Op.lte]: `${endYear}-12-31` };
        //         }
        //         if (cursor) {
        //             where.id = { [Sequelize.Op.gt]: cursor };
        //         }
        //
        //         const postmarks = await PostmarkModel.findAll({
        //             where,
        //             order: [['id', 'ASC']],
        //             limit: limit + 1,
        //         });
        //
        //         const postmarkIds = postmarks.map(p => p.id);
        //
        //         const images = await PostmarkImageModel.findAll({
        //             where: { postmark_id: postmarkIds },
        //             attributes: ['id', 'postmark_id'], // no blob
        //         });
        //
        //         const groupedImages = images.reduce((acc, img) => {
        //             (acc[img.postmark_id] ||= []).push({ id: img.id });
        //             return acc;
        //         }, {} as Record<number, { id: number }[]>);
        //
        //         const rows = postmarks.map(p => ({
        //             ...p.toJSON(),
        //             images: groupedImages[p.id] || [],
        //         }));
        //
        //
        //
        //
        //         let nextCursor: number | undefined = undefined;
        //         if (rows.length > limit) {
        //             const next = rows.pop();
        //             nextCursor = next!.id;
        //         }
        //
        //         return {
        //             // items: rows.map((r) => ({
        //             //     ...r.toJSON(),
        //             //     images: r.images?.map(img => ({ id: img.id })) ?? [],
        //             // })),
        //             items: rows,
        //             nextCursor,
        //         };
        //     }),

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
                        attributes: ['id'],
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
