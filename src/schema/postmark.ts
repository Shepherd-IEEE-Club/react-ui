import {z} from 'zod';

// This sillyness is to prevent mutating and confusion and bugs
const PostmarkImageSchema = z.object({
    id: z.number(),
    // FIXME Naughty .optionals
    postmark_id: z.number(),
    data: z.string(),
    thumbnail: z.string(),
});

const ThumbnailImageSchema = PostmarkImageSchema.pick(
    {
        id: true,
        thumbnail: true
    }
);
const FullImageSchema = PostmarkImageSchema.pick(
    {
        id: true,
        // postmark_id: true,
        data: true,
    }
);

const BasePostmarkSchema = z.object({
    id: z.number(),
    postmark: z.string(),
    town: z.string(),
    state: z.string(),
    date_seen: z.string().optional(),
    size: z.string().optional(),
    colors: z.string().optional(),
});

// variants
// this is not a zod object
export const PostmarkSchema = {
    full: BasePostmarkSchema.extend({
        images: z.array(PostmarkImageSchema),
    }),
    withThumbnail: BasePostmarkSchema.extend({
        images: z.array(ThumbnailImageSchema),
    }),
    withFullImage: BasePostmarkSchema.extend({
        images: z.array(FullImageSchema),
    }),
};
