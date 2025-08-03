import {router, publicProcedure, protectedProcedure} from '../trpc';
import {z} from 'zod';
import {UserModel} from '@woco/db/models/user';
import {createPasswordHash, verifyPassword} from '@woco/server/utils/password';

export const authRouter = router({
    signup: publicProcedure
        .input(z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(6),
        }))
        .mutation(async ({input}) => {
            const password_hash = createPasswordHash(input.password);
            const user = await UserModel.create({
                name: input.name,
                email: input.email,
                password_hash
            });
            return {id: user.id};
        }),

    login: publicProcedure
        .input(z.object({
            email: z.string().email(),
            password: z.string(),
        }))
        .mutation(async ({ctx, input}) => {
            const user = await UserModel.findOne({where: {email: input.email}});
            if (!user || !verifyPassword(input.password, user.password_hash)) {
                throw new Error('Invalid credentials');
            }

            ctx.session.user_id = user.id;
            await ctx.session.save();

            return {id: user.id, email: user.email};
        }),


    me: protectedProcedure
        .output(z.object({
            name: z.string(),
            email: z.string().email()
        }))
        .query(async ({ctx}) => {
            const user = await UserModel.findByPk(ctx.session.user_id);

            if (!user) throw new Error("Not authenticated");

            return {
                name: user.name,
                email: user.email
            };
        }),
});
