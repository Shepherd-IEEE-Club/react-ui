// src/server/trpc.ts
import { initTRPC } from '@trpc/server';
// If you want 1st-class Date/Map/Set support, install & use superjson:
import superjson from 'superjson';

/**
 * You should call initTRPC **only once** in your backend.
 * The helpers produced here are imported everywhere else.
 */
const t = initTRPC.create({
    // transformer: superjson, // optional but recommended
});

/**
 * Re-export the tiny helpers you need.
 * Feel free to export `middleware`, `mergeRouters`, etc. later.
 */
export const router = t.router;
export const procedure = t.procedure;   // public procedures
