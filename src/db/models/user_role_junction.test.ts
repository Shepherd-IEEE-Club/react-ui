import { UserModel } from './user';
import { RoleModel } from './role';
import { UserRoleModel } from './user_role_junction.ts';

import '../test_sync.ts'
process.on('unhandledRejection', (err) => {
    throw err;
});
describe('user_role table', () => {
    it('creates user_role join entry', async () => {
        const user = await UserModel.create({ name: 'jared', email: 'jared@fortnite.com'});
        const role = await RoleModel.create({ name: 'admin' });

        UserRoleModel.create({
            user_id: user.id,
            role_id: role.id,
        })


        const join = UserRoleModel.findOne({
            where: { user_id: user.id, role_id: role.id },
        });

        expect(join).toBeTruthy();
    });

    it('check roles relationship', async () => {
        const user = await UserModel.create({name: 'joe', email: 'joe@example.com'});
        const role = await RoleModel.create({name: 'skbiti'});

        await UserRoleModel.create({
            user_id: user.id,
            role_id: role.id,
        })


        const join = await UserRoleModel.findOne({
            where: { user_id: user.id, role_id: role.id },
        });

        const fortnite = await UserModel.findByPk(user.id, {
            include: { model: RoleModel, as: 'roles' },
        });

        const joins = await UserRoleModel.findAll();
        console.log(JSON.stringify(joins, null, 2));

        expect(fortnite).not.toBeNull();
        expect(fortnite!.roles).toBeInstanceOf(Array);
        expect(fortnite!.roles?.length).toBe(1);

        // @ts-ignore
        expect(fortnite.roles[0].name).toBe('skbiti');


    });

    it('removes join entry when user is deleted cascade', async () => {
        const user = await UserModel.create({ name: 'joe', email: 'fotnitee@example.com' });
        const role = await RoleModel.create({ name: 'editor' });

        await user.destroy();

        const join = await UserRoleModel.findOne({
            where: { user_id: user.id, role_id: role.id },
        });

        expect(join).toBeNull();
    });


});
