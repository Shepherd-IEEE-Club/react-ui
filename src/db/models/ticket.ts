// src/db/models/ticket.ts
import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
} from 'sequelize';
import { sequelize } from '../client';
import { PostmarkModel } from './postmark';

export class TicketStatusModel extends Model<
    InferAttributes<TicketStatusModel>,
    InferCreationAttributes<TicketStatusModel>
> {
    declare id: number;
    declare name: string;
}

TicketStatusModel.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
        sequelize,
        tableName: 'ticket_statuses',
        timestamps: false,
    }
);

export class TicketModel extends Model<
    InferAttributes<TicketModel>,
    InferCreationAttributes<TicketModel>
> {
    declare id: CreationOptional<number>;
    declare postmark_id: ForeignKey<number>;
    declare user_id: number;
    declare status_id: ForeignKey<number>;
    declare changes: Record<string, any>;
    declare comment: string | null;
    declare deny_comment: string | null;
    declare created_at: Date;
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
            references: { model: 'postmarks', key: 'id' },
            onDelete: 'CASCADE',
        },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        status_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'ticket_statuses', key: 'id' },
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
    },
    {
        sequelize,
        tableName: 'tickets',
        timestamps: false,
    }
);


PostmarkModel.hasMany(TicketModel, {
    foreignKey: 'postmark_id',
    as: 'tickets',
});

TicketModel.belongsTo(PostmarkModel, {
    foreignKey: 'postmark_id',
});

TicketModel.belongsTo(TicketStatusModel, {
    foreignKey: 'status_id',
    as: 'status',
});

TicketStatusModel.hasMany(TicketModel, {
    foreignKey: 'status_id',
});
