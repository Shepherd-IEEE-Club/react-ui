import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { getSession } from '../lib/session';
import { UserModel } from '@woco/db/models/user';

export type Context = {
    user: UserModel | null;
    session: Awaited<ReturnType<typeof getSession>>;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<Context> {
    const { req, res } = opts;

    const session = await getSession(req, res);

    let user: UserModel | null = null;
    if (session.user_id) {
        user = await UserModel.findByPk(session.user_id);
    }

    return {
        user,
        session,
    };
}