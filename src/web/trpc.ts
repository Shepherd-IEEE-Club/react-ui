import {createTRPCClient, createTRPCReact} from '@trpc/react-query';
import type { AppRouter } from 'src/server/trpc/appRouter.ts';
import superjson from "superjson";
import {httpBatchLink} from "@trpc/client";

export const trpc = createTRPCReact<AppRouter>();

// FIXME
export const trpcClient = createTRPCClient<AppRouter>({

    links: [
        httpBatchLink({
            url: 'http://localhost:3001/trpc',
            transformer: superjson,
        }),
    ],
});
