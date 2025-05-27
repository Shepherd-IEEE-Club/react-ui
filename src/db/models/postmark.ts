// src/db/models/postmark.ts
import {DataTypes, Model, InferAttributes, InferCreationAttributes} from 'sequelize';
import {sequelize} from '../client';

/* ---------- Postmark ---------- */
export class PostmarkModel extends Model<
    InferAttributes<PostmarkModel>,
    InferCreationAttributes<PostmarkModel>
> {
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
}

PostmarkImageModel.init(
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        postmark_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {model: 'postmarks', key: 'id'},
            onDelete: 'CASCADE',
        },
        //     TODO bytes instead of BS4
        data: {type: DataTypes.BLOB('long'), allowNull: false},
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


export {sequelize};
