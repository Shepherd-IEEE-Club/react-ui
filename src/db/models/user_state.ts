import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../client';
import { UserModel } from './user';
import { StateModel } from './state';

export class UserStateModel extends Model<
    InferAttributes<UserStateModel>,
    InferCreationAttributes<UserStateModel>
> {
    declare user_id: number;
    declare state_id: number;
}

UserStateModel.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
        },
        state_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: 'states', key: 'id' },
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        tableName: 'user_states',
        timestamps: false,
    }
);

UserModel.belongsToMany(StateModel, {
    through: UserStateModel,
    foreignKey: 'user_id',
    otherKey: 'state_id',
    as: 'states',
});

StateModel.belongsToMany(UserModel, {
    through: UserStateModel,
    foreignKey: 'state_id',
    otherKey: 'user_id',
    as: 'users',
});
