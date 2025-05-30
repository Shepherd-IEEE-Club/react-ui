import {router, procedure} from '@woco/server/trpc.ts';
import {PostmarkImageModel, PostmarkModel} from '@woco/db/models/postmark.ts';
import {fetchPaginatedPostmarks, PostmarkFilterSchema} from "../utils/fetchPaginatedPostmarks.ts";
import {FullImageSchema} from "@woco/schema/postmark.ts";
import {z} from "zod";

export const postmarksRouter = router({
    infinite: procedure
        .input(PostmarkFilterSchema)
        .query(async ({ input }) => {
            return fetchPaginatedPostmarks(input);
        }),

    // postmark id -> array of fullsize b64 images
    images: procedure
        .input(z.object({ postmark_id: z.number() }))
        .output(z.array(FullImageSchema))
        .query(async ({ input }) => {
            const images = await PostmarkImageModel.findAll({
                where: {
                    postmark_id: input.postmark_id
                },
                attributes: ['id', 'data'],
                order: [['id', 'ASC']],
            });

            return images.map(i => {
                const raw = i.get({ plain: true });
                return {
                    id: raw.id,
                    data: raw.data.toString('base64'),
                };
            });
        })


});

