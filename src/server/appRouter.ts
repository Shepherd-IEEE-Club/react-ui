import { router } from './trpc';
import { ticketsRouter } from './routers/tickets';
import { postmarksRouter } from './routers/postmarks';

export const appRouter = router({
    tickets: ticketsRouter,
    postmarks: postmarksRouter,
});

export type AppRouter = typeof appRouter;
