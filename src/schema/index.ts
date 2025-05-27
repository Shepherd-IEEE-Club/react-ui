import { z } from 'zod';

export const PostmarkSchema = z.object({
    id:            z.number(),
    postmark:      z.string(),
    town:          z.string(),
    state:         z.string(),
    date_seen:     z.string().optional(),
    size:          z.string().optional(),
    colors:        z.string().optional(),
});
export type Postmark = z.infer<typeof PostmarkSchema>;

export const PostmarkImageSchema = z.object({
    id: z.number(),
    postmark_id: z.number(),
    data: z.string(),
    thumbnail: z.string(),
    // caption: z.string().optional(),
});
export type PostmarkImage = z.infer<typeof PostmarkImageSchema>;

// TODO TRPC
export const PostmarkWithImagesSchema = PostmarkSchema.extend({
    images: z.array(PostmarkImageSchema),
});


export const TicketChangesSchema = PostmarkSchema
    .omit({ id: true})  // naughty fields
    .partial()  // all fields optional

    // for adding and removing images
    // TODO adding and removing images
    .extend({
        images: z.object({
            add: z.array(z.string()).optional(),
            remove: z.array(z.number()).optional(),
        }).optional(),
    })

    // catch empty ticket
    .refine(obj => Object.keys(obj).length > 0, {
        message: "ticket must include at least one change"
    });

export const TicketSchema = z.object({
    postmarkId: z.number(),
    body: z.string().optional(),
    changes: TicketChangesSchema,
});
