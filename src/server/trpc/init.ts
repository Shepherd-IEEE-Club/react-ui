import {initTRPC, TRPCError} from '@trpc/server';
import superjson from 'superjson';
import type { Context } from '../context.ts';


export const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

export const router = t.router;

// FIXME investigate
/**
 * Use this for any procedure that needs authentication.
 *
 *   protectedProcedure.query/ mutation(...)
 */
