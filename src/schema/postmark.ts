import { z } from 'zod';

export const PostmarkImageSchema = z.object({
    id: z.number(),
    postmark_id: z.number(),
    data: z.string(),
    thumbnail: z.string(),
    // caption: z.string().optional(),
});
export type PostmarkImage = z.infer<typeof PostmarkImageSchema>;

export const PostmarkSchema = z.object({
    id:            z.number(),
    postmark:      z.string(),
    town:          z.string(),
    state:         z.string(),
    date_seen:     z.string().optional(),
    size:          z.string().optional(),
    colors:        z.string().optional(),
    images: z.array(PostmarkImageSchema).optional()

});
export type Postmark = z.infer<typeof PostmarkSchema>;




