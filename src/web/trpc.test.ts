import { appRouter } from '@woco/server/appRouter';
import '@woco/db/test_sync.ts'

describe('tRPC Client (local caller)', () => {

    const caller = appRouter.createCaller({});

    it('should fetch paged postmarks without throwing', async () => {
        const result = await caller.postmark.infinite({ limit: 10 });

        expect(result).toBeDefined();
        expect(result.items).toBeInstanceOf(Array);
    });
});
