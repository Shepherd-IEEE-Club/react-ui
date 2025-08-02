import { DataTypes } from 'sequelize';
import { sequelize } from '../client.ts';
import { UserModel } from './user.ts';
import { StateModel } from './state.ts';
import {RoleModel} from "./role.ts";
import {UserRoleModel} from "./user_role_junction.ts";

const UserStateModel = sequelize.define('user_state', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: UserModel, key: 'id' },
        onDelete: 'CASCADE', // delete junction row when user is deleted
    },

    state_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: StateModel, key: 'id' },
        // don't delete junction row when state is deleted
    },
}, {
    timestamps: false,
});

UserModel.belongsToMany(StateModel, {
    through: UserStateModel,
    as: 'states',
    foreignKey: 'user_id',
    otherKey: 'state_id',
});

StateModel.belongsToMany(UserModel, {
    through: UserStateModel,
    as: 'users',
    foreignKey: 'state_id',
    otherKey: 'user_id',
});




export { UserStateModel };
