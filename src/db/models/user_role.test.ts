import { Sequelize } from 'sequelize';
import { DataTypes } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:', { logging: false });

import { UserModel } from './user';
import { RoleModel } from './role';
import { UserRoleModel } from './user_role';



describe('user_role table', () => {
    it('creates user_role join entry', async () => {
        const user = await UserModel.create({ name: 'Alice', email: 'alice@example.com' });
        const role = await RoleModel.create({ name: 'admin' });

        await user.$add('roles', role); // relies on belongsToMany association

        const join = await UserRoleModel.findOne({
            where: { user_id: user.id, role_id: role.id },
        });

        expect(join).toBeTruthy();
    });

    it('removes join entry when user is deleted (CASCADE)', async () => {
        const user = await UserModel.create({ name: 'Bob', email: 'bob@example.com' });
        const role = await RoleModel.create({ name: 'editor' });
        await user.$add('roles', role);

        await user.destroy();

        const join = await UserRoleModel.findOne({
            where: { user_id: user.id, role_id: role.id },
        });

        expect(join).toBeNull();
    });
});
