import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import type { UserModel } from '@woco/db/models/user';

export type Context = {
    user?: UserModel | null;
};

export async function createContext(_opts?: Partial<CreateExpressContextOptions>): Promise<Context> {
    return { user: null };
}
