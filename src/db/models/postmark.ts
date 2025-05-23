import { DataTypes } from 'sequelize';
import { sequelize } from '../client';

export const PostmarkModel = sequelize.define('Postmark', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    image: {
        type: DataTypes.BLOB,
        allowNull: false,
    },
    postmark: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    town: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date_seen: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    size: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    colors: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'postmarks', // Must match your table name exactly.
    timestamps: false,      // Disable if your table doesn't have createdAt/updatedAt.
});