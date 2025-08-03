import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from 'src/server/trpc/appRouter';
import superjson from 'superjson';
import { z } from 'zod';

// Optional: Define the input schema for validation (if not imported from shared schema)
const TicketMineInputSchema = z.object({
    limit: z.number().min(1).max(10000).default(50),
    cursor: z.number().optional(),
    user_id: z.number(),
});

const client = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:3001/trpc',
            transformer: superjson,
        }),
    ],
});

async function main() {
    const input = {
        limit: 1000,
        user_id: 1,
        // cursor: 0,
    };

    const result = TicketMineInputSchema.safeParse(input);
    if (!result.success) {
        console.error('❌ Zod validation failed:', result.error.format());
        return;
    }

    try {
        const response = await client.tickets.mine.query(result.data);

        console.log('✅ tickets.mine responded:', response, 'ticket(s)');
        console.log('🖼️ Included postmarks:', Object.keys(response.postmarks).length);
        console.log('➡️ Next cursor:', response.nextCursor);
    } catch (err: any) {
        console.error('❌ tRPC query failed:', err.message ?? err);
    }
}

main();
