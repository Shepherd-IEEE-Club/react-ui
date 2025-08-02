import {DataTypes} from "sequelize";
import {sequelize} from "../client.ts";
import {RoleModel} from "./role.ts";
import {UserModel} from "./user.ts";


const UserRoleModel = sequelize.define('user_role',
     {

        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: UserModel, key: 'id' },
            onDelete: 'CASCADE', // delete junction row when user is deleted
        },

        role_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: RoleModel, key: 'id' },
            // do not delete junction row when role is deleted :wilted_rose:
        },
    }

)

UserModel.belongsToMany(RoleModel, {
    as: 'roles',
    through: UserRoleModel,
    foreignKey: 'user_id',
    otherKey: 'role_id',
});

RoleModel.belongsToMany(UserModel, {
    as: 'users',
    through: UserRoleModel,
    foreignKey: 'role_id',
    otherKey: 'user_id',
});

export {UserRoleModel};