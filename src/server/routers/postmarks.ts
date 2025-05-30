import {router, procedure} from '@woco/server/trpc.ts';
import {PostmarkImageModel, PostmarkModel} from '@woco/db/models/postmark.ts';
import {fetchPaginatedPostmarks, PostmarkFilterSchema} from "../utils/fetchPaginatedPostmarks.ts";
import {FullImageSchema, PostmarkSchema} from "@woco/schema/postmark.ts";
import {z} from "zod";

export const postmarksRouter = router({
    infinite: procedure
        .input(PostmarkFilterSchema)
        .query(async ({ input }) => {
            return fetchPaginatedPostmarks(input);
        }),

    // postmark -> array of fullsize b64 images
    images: procedure
        .input(PostmarkSchema.pick({ id: true })) // Just need id.
        .output(z.array(FullImageSchema))
        .query(async ({ input }) => {
            const images = await PostmarkImageModel.findAll({
                where: {
                    postmark_id: input.id
                },
                attributes: ['id', 'data'],

                // TODO user settable order
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

