import '@woco/db/test_sync.ts'
import {makeTestCaller} from "../../test/test_caller.ts";


const caller = await makeTestCaller(
    {user_id: 21}
);

describe('tRPC Client', () => {
    it('should fetch paged postmarks without throwing', async () => {
        const result = await caller.postmark.infinite({ limit: 10 });

        expect(result).toBeDefined();
        expect(result.items).toBeInstanceOf(Array);
    });
});
