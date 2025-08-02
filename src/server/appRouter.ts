import { router } from './trpc';
import { ticketsRouter } from './routers/ticket.ts';
import { postmarksRouter } from './routers/postmark.ts';

export const appRouter = router({
    ticket: ticketsRouter,
    postmark: postmarksRouter,
});

export type AppRouter = typeof appRouter;
