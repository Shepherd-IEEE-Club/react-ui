// test/fakeSession.ts
import type { IronSession } from 'iron-session';
import type { SessionData } from '@woco/lib/session';


export function createFakeSession(
    data: Partial<SessionData> = {},
): IronSession<SessionData> {
    return {
        ...data,

        save: async () => {},
        destroy: async () => {},
        regenerate: async () => {},
        reload: async () => {},
        updateConfig: async () => {},
        touched: false,
        id: '' as any,
        cookie: {} as any,
    } as unknown as IronSession<SessionData>;
}
