import {DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {sequelize} from "../client.ts";
import {RoleModel} from "./role.ts";
import {UserModel} from "./user.ts";


export class UserRoleModel extends Model<
    InferAttributes<UserRoleModel>,
    InferCreationAttributes<UserRoleModel>
> {
    declare user_id: number;
    declare role_id: number;
}

UserRoleModel.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
        },
        role_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: 'roles', key: 'id' },
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        tableName: 'user_roles',
        timestamps: false,
    }
);

UserModel.belongsToMany(RoleModel, {
    through: UserRoleModel,
    foreignKey: 'user_id',
    otherKey: 'role_id',
    as: 'roles',
});

RoleModel.belongsToMany(UserModel, {
    through: UserRoleModel,
    foreignKey: 'role_id',
    otherKey: 'user_id',
    as: 'users',
});