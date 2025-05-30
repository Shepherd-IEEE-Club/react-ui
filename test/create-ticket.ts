import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@woco/server/appRouter';
import superjson from 'superjson';
import { TicketInputSchema } from '@woco/schema/ticket';

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
        postmark_id: 1,
        user_id: 1,
        changes: {
            town: 'Newtown',
            colors: 'red and blue',
            remove_images: [1, 2]
        },
        comment: 'Corrected town and added colors',
    };

    const result = TicketInputSchema.safeParse(input);
    if (!result.success) {
        console.error('❌ Zod validation failed:', result.error.format());
        return;
    }

    try {
        const response = await client.tickets.create.mutate(result.data);
        console.log('✅ Ticket created:', response);
    } catch (err: any) {
        console.error('❌ tRPC mutation failed:', err.message ?? err);
    }
}

main();
