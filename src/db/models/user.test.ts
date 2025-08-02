import { UserModel } from './user';

import '../test_sync.ts';

describe('UserModel', () => {
    it('should create a user successfully', async () => {
        const user = await UserModel.create({ name: 'Alice', email: 'alice@example.com' });
        expect(user.id).toBeDefined();
        expect(user.name).toBe('Alice');
        expect(user.email).toBe('alice@example.com');
    });

    it('should not allow duplicate emails', async () => {
        await UserModel.create({ name: 'Bob', email: 'bob@example.com' });

        await expect(
            UserModel.create({ name: 'Bobby', email: 'bob@example.com' })
        ).rejects.toThrow();
    });

    it('should not allow null name', async () => {
        await expect(
            UserModel.create({ name: null as any, email: 'nullname@example.com' })
        ).rejects.toThrow();
    });

    it('should not allow null email', async () => {
        await expect(
            UserModel.create({ name: 'NoEmail', email: null as any })
        ).rejects.toThrow();
    });
});
