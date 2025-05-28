import {router, procedure} from '@woco/server/trpc.ts';
import {z} from 'zod';
import {Sequelize} from 'sequelize';
import {PostmarkImageModel, PostmarkModel} from '@woco/db/models/postmark.ts';
import {GetImagesInput} from '@woco/schema/image.ts';
import {fetchPaginatedPostmarks, PostmarkFilterSchema} from "../utils/fetchPaginatedPostmarks.ts";
import {FullImageSchema} from "@woco/schema/postmark.ts";

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

