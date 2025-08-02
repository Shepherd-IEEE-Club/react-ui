import {DataTypes, Model} from "sequelize";
import { sequelize } from "../client";

// This is for admin created fields

export class AdhocColumnModel extends Model {
    declare name: string;
    declare payload: Record<string, any>;
}

AdhocColumnModel.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        payload: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'adhoc_column',
        timestamps: false,
    }
);
