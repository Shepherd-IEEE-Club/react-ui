import {PostmarkModel, RoleModel, sequelize, UserModel, UserRoleModel} from "@woco/db/models";
import {makeTestCaller} from "../../../../test/test_caller.ts";

describe('requireAdmin middleware', () => {
    beforeAll(async () => {
        // fresh in-memory DB for each test run
        await sequelize.sync({ force: true });

        // dummy postmark so the resolver returns something
        await PostmarkModel.create({
            id: 1,
            postmark: 'NYC',
            town: 'New York',
            state: 'NY',
        });

        // ---- seed roles & users --------------------------------------------
        const [adminRole] = await RoleModel.findOrCreate({ where: { name: 'admin' } });
        const [userRole]  = await RoleModel.findOrCreate({ where: { name: 'user'  } });

        const adminUser   = await UserModel.create({ name: 'chungus', id: 1, email: 'admin@example.com',  password_hash: '' });
        const normalUser  = await UserModel.create({ name: 'bungus', id: 2, email: 'user@example.com',   password_hash: '' });

        // join rows **without** $add()
        await UserRoleModel.create({name: adminUser.name, user_id: adminUser.id,  role_id: adminRole.id });
        await UserRoleModel.create({name: normalUser.name, user_id: normalUser.id, role_id: userRole.id  });
    });

    it('rejects a non-admin with FORBIDDEN', async () => {
        const caller = await makeTestCaller({ user_id: 2 }); // normal user

        await expect(
            caller.postmark.infinite({ limit: 5 }),
        ).rejects.toMatchObject({ code: 'FORBIDDEN' });
    });

    // it('allows an admin through', async () => {
    //     const caller = await makeTestCaller({ user_id: 1 }); // admin user
    //
    //     const res = await caller.postmark.infinite({ limit: 5 });
    //
    //     expect(res.items).toBeInstanceOf(Array);
    //
    //     // @ts-ignore
    //     expect(res.items[0].postmark).toBe('NYC');
    // });
});