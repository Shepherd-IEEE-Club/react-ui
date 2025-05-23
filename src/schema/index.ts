import { z } from 'zod';

export const PostmarkSchema = z.object({
    id:            z.number(),
    image:         z.string().nullable(),            // we’ll stringify blobs
    postmark:      z.string(),
    town:          z.string(),
    state:         z.string(),
    date_seen:     z.string().optional(),            // might be null/undefined
    size:          z.string().optional(),
    colors:        z.string().optional(),
});

export type Postmark = z.infer<typeof PostmarkSchema>;
export const PostmarkListSchema = z.array(PostmarkSchema);
export type PostmarkList = z.infer<typeof PostmarkListSchema>;
