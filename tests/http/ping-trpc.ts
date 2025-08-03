// scripts/trpc-check.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from 'src/server/trpc/appRouter';

const client = createTRPCProxyClient<AppRouter>({
    // transformer: superjson,
    links: [
        httpBatchLink({
            url: 'http://localhost:3001/trpc', // must be /trpc
        }),
    ],
});

async function main() {
    const res = await client.postmarks.paged.query({ page: 1 });
    console.log('✅ Got result:', res);
}

main().catch(err => {
    console.error('❌ tRPC error:', err);
});
