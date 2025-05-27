import { z } from 'zod';

export const GetImagesInput = z.object({
    ids: z.array(z.number()).min(1),
});

export type GetImagesInput = z.infer<typeof GetImagesInput>;
