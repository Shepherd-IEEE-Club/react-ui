import {z} from 'zod';

export const PostmarkSchema = z.object({
    id: z.number(),
    postmark: z.string(),
    town: z.string(),
    state: z.string(),
    date_seen: z.string().nullable().optional(),
    size: z.string().nullable().optional(),
    colors: z.string().nullable().optional(),
});

// Postmark with a thumbnail
export const PostmarkTableRowSchema = PostmarkSchema.extend({
    thumbnail: z.string(),                  // base64 thumbnail
});

export const PostmarkImageSchema = z.object({
    id: z.number(),
    postmark_id: z.number(),
    data: z.string(),      // full image as base64
    thumbnail: z.string(), // thumbnail as base64
});

export const FullImageSchema = z.object({
    id: z.number(),
    data: z.string(),
});
