import { z } from 'zod';
import {PostmarkSchema} from "./postmark.ts";

// ticket shit
export const TicketChangesSchema = PostmarkSchema
    .omit({ id: true})  // naughty fields
    .partial()  // all fields optional

    // for adding and removing images
    // TODO adding and removing images
    // .extend({
    //     images: z.object({
    //         add: z.array(z.string()).optional(),
    //         remove: z.array(z.number()).optional(),
    //     }).optional(),
    // })

    // catch empty ticket
    .refine(obj => Object.keys(obj).length > 0, {
        message: "ticket must include at least one change"
    });

export const TicketSchema = z.object({
    id: z.number(),
    postmark_id: z.number(),
    user_id: z.number(),

    // TODO enum 'pending', 'approved', 'rejected'
    status: z.number(),
    changes: TicketChangesSchema,
    comment: z.string().optional(),
    created_at: z.date(),
});
