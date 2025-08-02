import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
    dialect: (process.env.DB_DIALECT ?? 'sqlite') as any,
    storage: process.env.DB_FILE ?? '../data/postmarks.db',
    logging:  true,
});

export async function initDb() {
    await sequelize.authenticate();
    console.log('✅ Database connected');
}
