import {
    DataTypes,
    Model,
    CreationOptional
} from 'sequelize';

import { sequelize } from '../client';
import {RoleModel} from "./role.ts";
import {StateModel} from "./state.ts";


export class UserModel extends Model {
    declare id: CreationOptional<number>;
    declare name: string;
    declare email: string;

    declare roles?: RoleModel[];
    declare states?: StateModel[];
}

UserModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
        sequelize,
        tableName: 'user',
        timestamps: false,
    }
);



