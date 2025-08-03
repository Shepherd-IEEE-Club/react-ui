import {initTRPC, TRPCError} from '@trpc/server';
import superjson from 'superjson';
import type { Context } from './context';

const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const requireUser = t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user_id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    // downstream resolvers will get ctx.userId (non-nullable)
    return next({
        ctx: {
            ...ctx,
            userId: ctx.session.user_id,
        },
    });
});

export const protectedProcedure = t.procedure.use(requireUser);









// FIXME investigate
/**
 * Use this for any procedure that needs authentication.
 *
 *   protectedProcedure.query/ mutation(...)
 */