import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {sequelize} from "../client.ts";

export class RoleModel extends Model<
    InferAttributes<RoleModel>,
    InferCreationAttributes<RoleModel>
> {
    declare id: CreationOptional<number>;
    declare name: string;
}

RoleModel.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
        sequelize,
        tableName: 'roles',
        timestamps: false,
    }
);
