import { appRouter } from '@woco/server/appRouter';
import { sequelize } from '@woco/db/client';
import { UserModel } from '@woco/db/models/user';
import { verifyPassword } from '@woco/server/utils/password.ts';
import '@woco/db/test_sync.ts';


describe('authRouter', () => {
    const caller = appRouter.createCaller({});

    it('creates user and stores correct password hash', async () => {
        const email = 'hashcheck@example.com';
        const rawPassword = 'S3cr3t!';
        const name = "sofsfsfds"

        const res = await caller.auth.signup({
            name,
            email,
            password: rawPassword
        });

        const user = await UserModel.findOne({ where: { email } });

        expect(user).toBeTruthy();
        expect(user!.password_hash).not.toBe(rawPassword);
        expect(verifyPassword(rawPassword, user!.password_hash)).toBe(true);
    });

    it('can log in with password created at signup', async () => {
        const email = 'logincheck@example.com';
        const password = 'mypassword';
        const name = "sofsfsfds";

        const { id } = await caller.auth.signup({name, email, password });

        const login = await caller.auth.login({ email, password });

        expect(login.id).toBe(id);
    });

    it('fails to log in with incorrect password', async () => {
        await caller.auth.signup({
            name: "fortnite",
            email: 'wrongpass@example.com',
            password: 'correct123',
        });

        await expect(
            caller.auth.login({
                email: 'wrongpass@example.com',
                password: 'incorrect123',
            })
        ).rejects.toThrow('Invalid credentials');
    });
});
