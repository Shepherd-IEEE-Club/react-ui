import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from 'src/server/trpc/appRouter'; // ✅ correct type
import superjson from 'superjson';

const client = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:3001/trpc', // adjust if needed
            transformer: superjson, // ✅ Required to match the server
        }),
    ],
});

async function main() {
    const res = await client.postmarks.infinite.query({
        limit: 10,
        cursor: null,
        // startYear: 1900,
        // endYear: 1920,
    });

    console.log('✅ Got result:', res.items.length);
    console.log('➡️ Next cursor:', res.nextCursor);
}

main().catch(err => console.error('❌ tRPC Error:', err));
