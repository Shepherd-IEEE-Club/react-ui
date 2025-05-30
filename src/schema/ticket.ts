import { z } from 'zod';
import {PostmarkSchema} from "./postmark.ts";

// ticket shit
export const TicketChangesSchema = PostmarkSchema
    .omit({ id: true})  // naughty fields
    .partial()  // all fields optional

    // TODO stricter validation
    // for adding and removing images
    .extend({
        remove_images: z.array(z.number()).optional(),
        // images: z.object({
        //     add: z.array(z.number()).optional(),
        //
        // }).optional()
    })

    // catch empty ticket
    .refine(obj => Object.keys(obj).length > 0, {
        message: "ticket must include at least one change"
    });

export const TicketSchema = z.object({
    id: z.number(),
    postmark_id: z.number(),
    user_id: z.number(),

    status_id: z.number(),
    changes: TicketChangesSchema,
    comment: z.string().nullable().optional(),
    deny_comment: z.string().nullable().optional(),
    created_at: z.date(),
});


// For client mutations
export const TicketInputSchema = z.object({
    postmark_id: z.number(),
    user_id: z.number(),
    changes: TicketChangesSchema,
    comment: z.string().optional(),
    status_id: z.number().optional(),
});


export type Ticket = z.infer<typeof TicketSchema>;
