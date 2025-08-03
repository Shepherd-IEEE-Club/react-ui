import { t } from '../init';
import { TRPCError } from '@trpc/server';
import {UserModel} from "@woco/db/models";


export const requireAdmin = t.middleware(async ({ ctx, next }) => {
    const userId = ctx.session?.user_id;
    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const user = await UserModel.findByPk(userId, { attributes: ['id', 'role'] });
    const isAdmin = user?.roles?.some(r => r.name === 'admin');


    if (!isAdmin) {
        throw new TRPCError({ code: 'FORBIDDEN' });
    }

    return next({
        ctx: { ...ctx, user_id: user?.id },
    });
});
