// src/db/models/postmark.ts
import {DataTypes, Model, ForeignKey, NonAttribute} from 'sequelize';
import {sequelize} from '../client';
import { TicketModel } from './ticket';

export class PostmarkModel extends Model {
    declare id: number;
    declare postmark: string; // "name"
    declare town: string;
    declare state: string;
    declare date_seen: string | null;
    declare size: string | null;
    declare colors: string | null;
    declare adhoc: Record<string, any>;
    declare images: NonAttribute<PostmarkImageModel[]>;
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

        adhoc: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        }




    },
    {
        sequelize,
        tableName: 'postmark',
        freezeTableName: true,
        timestamps: false,
    }
);


export class PostmarkImageModel extends Model {
    declare id: number

    declare postmark_id?: ForeignKey<number>;
    declare postmark?: PostmarkModel;

    declare ticket_id?: ForeignKey<number>;
    declare ticket?: TicketModel;

    declare data: Buffer;
    declare thumbnail: string;

}

PostmarkImageModel.init(
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},

        // Images can belong to a ticket or postmar
        // TODO or both?? uhhmmm
        postmark_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {model: PostmarkModel, key: 'id'},

            // delete image when postmark is deleted
            onDelete: 'CASCADE',

        },
        ticket_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {model: TicketModel, key: 'id'},
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


PostmarkModel.hasMany(TicketModel, {
    foreignKey: 'postmark_id',
    as: 'tickets',
});

TicketModel.belongsTo(PostmarkModel, {
    foreignKey: 'postmark_id',
    as: 'postmark',
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
