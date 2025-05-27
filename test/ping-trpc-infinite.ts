import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '@woco/server/appRouter';

const client = createTRPCProxyClient<AppRouter>({
    // transformer: superjson, // optional
    links: [
        httpBatchLink({
            url: 'http://localhost:3001/trpc', // must be /trpc
        }),
    ],
});

async function main() {
    const res = await client.postmarks.infinite.query({
        limit: 10,
        cursor: null,
        // startYear: 1890,
        // endYear: 1920,
    });

    console.log('✅ Got result:', res.items.length, 'items');
    console.log('➡️ Next cursor:', res.nextCursor);
}

main().catch(err => {
    console.error('❌ tRPC error:', err);
});
