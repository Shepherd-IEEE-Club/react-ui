import { t } from '../init.ts';
import {TRPCError} from "@trpc/server";

export const requireUser = t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user_id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    // downstream resolvers will get ctx.userId
    return next({
        ctx: {
            ...ctx,
            userId: ctx.session.user_id,
        },
    });
});
