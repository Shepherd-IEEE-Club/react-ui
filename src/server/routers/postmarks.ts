import {router, procedure} from '@woco/server/trpc.ts';
import {PostmarkImageModel, PostmarkModel} from '@woco/db/models/postmark.ts';
import {
    buildPostmarkWhereClause,
    fetchPaginatedPostmarks,
    PostmarkFilterSchema
} from "../utils/fetchPaginatedPostmarks.ts";
import {FullImageSchema, ImageMapSchema, PostmarkImageSchema, PostmarkSchema} from "@woco/schema/postmark.ts";
import {z} from "zod";

export const postmarksRouter = router({
    infinite: procedure
        .input(
            z.object({
                limit: z.number().min(1).max(10000).default(50),
                cursor: z.number().optional()
            })
        )
        .query(async ({ input }) => {
            const { limit, cursor } = input;
            const PAGE_SIZE = limit;

            const where = {
                ...buildPostmarkWhereClause(input),
                ...(cursor ? { id: { [Op.gt]: cursor } } : {})
            };

            const rows = await PostmarkModel.findAll({
                where,
                order: [['id', 'ASC']],
                limit: PAGE_SIZE + 1,
                attributes: ['id', 'postmark', 'town', 'state', 'date_seen'],
                include: [{
                    model: PostmarkImageModel,
                    as: 'images',
                    attributes: ['id', 'thumbnail'],
                    separate: true,
                }],
            });

            const hasNextPage = rows.length > PAGE_SIZE;
            const items = hasNextPage ? rows.slice(0, -1) : rows;
            const nextCursor = hasNextPage ? rows[PAGE_SIZE].id : undefined;

            return {
                items: items.map(r => ({
                    ...r.toJSON(),
                    imageIds: r.images.map(img => img.id),
                })),
                nextCursor,
            };
        }),


    // postmark -> array of fullsize b64 images
    images: procedure
        .input(PostmarkSchema.pick({ id: true })) // Just need id.
        .output(z.array(PostmarkImageSchema))
        .query(async ({ input }) => {
            const images = await PostmarkImageModel.findAll({
                where: {
                    postmark_id: input.id
                },
                // attributes: ['id', 'data'],

                // TODO user settable order
                order: [['id', 'ASC']],
            });
            console.log(images)

            return images.map(img => ({
                ...img.get({ plain: true }),
                data: img.data.toString('base64'),
            }));

        })


});

