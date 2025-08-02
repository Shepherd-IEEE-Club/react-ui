import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {sequelize} from "../client.ts";
import {UserModel} from "./user.ts";

export class RoleModel extends Model {
    declare id: CreationOptional<number>;
    declare name: string;

    declare users?: UserModel[];

}

RoleModel.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
        sequelize,
        tableName: 'role',
        modelName: 'role',
        timestamps: false,
    }
);
