// src/db/models/ticket.ts
import {
    DataTypes,
    Model,
    CreationOptional,
    ForeignKey,
} from 'sequelize';
import { sequelize } from '../client';
import { PostmarkModel } from './postmark';
import {UserModel} from "./user.ts";

export class TicketStatusModel extends Model{
    declare id: number;
    declare name: string;
}

TicketStatusModel.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: UserModel, key: 'id' },

            // cascade?
        },
    },

    {
        sequelize,
        tableName: 'ticket_status',
        timestamps: false,
    }
);

export class TicketModel extends Model {
    declare id: CreationOptional<number>;

    declare postmark_id: ForeignKey<number>;
    declare postmark?: "postmark";

    declare user_id: number;
    declare user?: UserModel;

    declare status_id: ForeignKey<number>;
    declare status?: TicketStatusModel;

    declare changes: Record<string, any>;
    declare comment: string | null;
    declare deny_comment: string | null;
    declare created_at: Date;

    declare adhoc: Record<string, any>;


}

TicketModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        postmark_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "postmark", key: 'id' },
            onDelete: 'CASCADE',
        },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        status_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: TicketStatusModel, key: 'id' },
        },
        changes: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        deny_comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },

        adhoc: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    },
    {
        sequelize,
        tableName: 'ticket',
        timestamps: false,
    }
);





TicketStatusModel.hasMany(TicketModel, {
    foreignKey: 'status_id',
    as: 'tickets',
});
TicketModel.belongsTo(TicketStatusModel, {
    foreignKey: 'status_id',
    as: 'status',
});

UserModel.hasMany(TicketModel, {
    foreignKey: 'user_id',
    as: 'tickets',
});
TicketModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user',
});

