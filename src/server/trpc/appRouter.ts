import { router } from './init.ts';
import { ticketsRouter } from './routers/ticket.ts';
import { postmarksRouter } from './routers/postmark.ts';
import {authRouter} from "./routers/auth.ts";

export const appRouter = router({
    auth: authRouter,
    ticket: ticketsRouter,
    postmark: postmarksRouter,
});

export type AppRouter = typeof appRouter;
