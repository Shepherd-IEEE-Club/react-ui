import {router} from '../index.ts';
import {publicProcedure} from "../procedures.ts";
import {PostmarkImageModel, PostmarkModel} from '@woco/db/models/postmark.ts';
// import {
//     buildPostmarkWhereClause,
//     // fetchPaginatedPostmarks,
//     PostmarkFilterSchema
// } from "../utils/fetchPaginatedPostmarks.ts";


import {PostmarkImageSchema, PostmarkSchema, PostmarkTableRowSchema} from "@woco/schema/postmark.ts";
import {z} from "zod";
import {Op, WhereOptions} from "sequelize";

const PostmarkFilterSchema = z.object({
    limit: z.number().min(1).max(10000).default(50),
    cursor: z.number().nullish(),

    postmark: z.string().optional(),

});

export type PostmarkFilterInput = z.infer<typeof PostmarkFilterSchema>;

function buildPostmarkWhereClause(
    input: PostmarkFilterInput
): WhereOptions {
    const where: WhereOptions = {};

    // Pagination
    // if (input.cursor) {
    //     where.id = { [Op.gt]: input.cursor };
    // }

    // Filter: partial match on "postmark" field
    if (input.postmark) {
        where.postmark = { [Op.iLike]: `%${input.postmark}%` };
    }

    return where;
}


export const postmarksRouter = router({


    // get postmarks with pagination and optional filters
    infinite: publicProcedure
        .input(
            PostmarkFilterSchema
        ).output(z.object({
                items: z.array(PostmarkTableRowSchema),
                nextCursor: z.number().optional(),
            }))
        .query(async ({ input }) => {
            const { limit, cursor } = input;
            const PAGE_SIZE = limit;

            const where = {
                ...buildPostmarkWhereClause(input),
                ...(cursor ? { id: { [Op.gt]: cursor } } : {})
            };

            const rows: PostmarkModel[] = await PostmarkModel.findAll({
                where,
                order: [['id', 'ASC']],
                limit: PAGE_SIZE + 1,
                attributes: ['id', 'postmark', 'town', 'state', 'date_seen'],


                include: [
                    // attach thumbnail to satisfy the postmarktablerowschema
                    {
                    model: PostmarkImageModel,
                    as: 'images',

                    // no data column
                    attributes: ['id', 'thumbnail'],
                    separate: true,

                    // only need 1 thumbnail
                    limit: 1
                }],
            });

            const hasNextPage = rows.length > PAGE_SIZE;
            const items = hasNextPage ? rows.slice(0, -1) : rows;

            const nextCursor = hasNextPage ? rows[PAGE_SIZE]!.id : undefined;

            return {
                items: items.map(r => r.toJSON()),
                nextCursor,
            };
        }),


    // postmark -> array of fullsize b64 images
    images: publicProcedure
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

