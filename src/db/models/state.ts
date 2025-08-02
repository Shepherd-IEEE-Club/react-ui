import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {sequelize} from "../client.ts";

export class StateModel extends Model {
    declare id: number;
    declare code: string;
    declare name: string;
}

StateModel.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        code: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
    },
    {
        sequelize,
        tableName: 'state',
        timestamps: false,
    }
);
