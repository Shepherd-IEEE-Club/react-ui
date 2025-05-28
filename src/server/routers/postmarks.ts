import {router, procedure} from '@woco/server/trpc.ts';
import {z} from 'zod';
import {Sequelize} from 'sequelize';
import {PostmarkImageModel, PostmarkModel} from '@woco/db/models/postmark.ts';
import {GetImagesInput} from '@woco/schema/image.ts';
import {fetchPaginatedPostmarks, PostmarkFilterSchema} from "../utils/fetchPaginatedPostmarks.ts";

export const postmarksRouter = router({
    infinite: procedure
        .input(PostmarkFilterSchema)
        .query(async ({ input }) => {
            return fetchPaginatedPostmarks(input);
        }),

    getImages: procedure
        .input(GetImagesInput)
        .query(async ({input}) => {
            const images = await PostmarkImageModel.findAll({
                where: {id: input.ids},
                attributes: ['id', 'data'],
            });

            return images.map(img => ({
                id: img.id,
                base64: img.data.toString('base64'),
            }));
        }),


});

