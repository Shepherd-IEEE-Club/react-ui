// src/db/models/postmark.ts
import {DataTypes, Model, InferAttributes, InferCreationAttributes, ForeignKey} from 'sequelize';
import {sequelize} from '../client';
import {TicketModel} from "./ticket.ts";

/* ---------- Postmark ---------- */
export class PostmarkModel extends Model<
    InferAttributes<PostmarkModel>,
    InferCreationAttributes<PostmarkModel>
> {
    declare id: number;
    declare postmark: string;
    declare town: string;
    declare state: string;
    declare date_seen: string | null;
    declare size: string | null;
    declare colors: string | null;
}

PostmarkModel.init(
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        postmark: {type: DataTypes.STRING, allowNull: false},
        town: {type: DataTypes.STRING, allowNull: false},
        state: {type: DataTypes.STRING, allowNull: false},
        date_seen: {type: DataTypes.STRING, allowNull: true},
        size: {type: DataTypes.STRING, allowNull: true},
        colors: {type: DataTypes.STRING, allowNull: true},
    },
    {
        sequelize,
        tableName: 'postmarks',
        timestamps: false,
    }
);

/* ---------- PostmarkImage ---------- */
export class PostmarkImageModel extends Model<
    InferAttributes<PostmarkImageModel>,
    InferCreationAttributes<PostmarkImageModel>
> {
    declare id: number
    declare postmark_id: ForeignKey<number>;
    declare ticket_id: ForeignKey<number>;
    declare data: Buffer;
    declare thumbnail: string;

}

PostmarkImageModel.init(
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        postmark_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {model: 'postmarks', key: 'id'},
            // onDelete: 'CASCADE',
        //     TODO
        },
        ticket_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {model: 'tickets', key: 'id'},
            // onDelete: 'CASCADE',
        },
        //     TODO bytes instead of BS4
        data: {type: DataTypes.BLOB('long'), allowNull: false},
        thumbnail: {type: DataTypes.STRING}
    },
    {
        sequelize,
        tableName: 'postmark_images',
        timestamps: false,
    }
);

PostmarkModel.hasMany(PostmarkImageModel, {
    foreignKey: 'postmark_id',
    as: 'images',
});

PostmarkImageModel.belongsTo(PostmarkModel, {
    foreignKey: 'postmark_id',
});

//FIXME

// TicketModel.hasMany(PostmarkImageModel, {
//     foreignKey: 'ticket_id',
//     as: 'images',
// });
//
// PostmarkImageModel.belongsTo(TicketModel, {
//     foreignKey: 'ticket_id',
// });


export {sequelize};
