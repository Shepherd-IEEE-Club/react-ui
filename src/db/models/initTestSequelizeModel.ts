// in-memory table for testing
import {
    Sequelize,
    Model,
    ModelAttributes,
    InitOptions,
    ModelStatic,
} from 'sequelize';

export async function initTestSequelizeModel<M extends Model>(
    modelClass: ModelStatic<M>,
    attributes: ModelAttributes,
    tableName: string
): Promise<Sequelize> {
    const sequelize = new Sequelize('sqlite::memory:', { logging: false });

    modelClass.init(attributes, {
        sequelize,
        tableName,
        timestamps: false,
    });

    await sequelize.sync({ force: true });

    return sequelize;
}
