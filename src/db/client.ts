import { Sequelize } from 'sequelize';

// Pull settings from env vars so you can swap DBs by changing .env
export const sequelize = new Sequelize({
    dialect: (process.env.DB_DIALECT ?? 'sqlite') as any,  // 'sqlite' | 'postgres' | 'mysql' …
    storage: process.env.DB_FILE ?? '../data/postmarks.db',
    logging:  true,
});

// Helper so server.ts can verify the connection once
export async function initDb() {
    await sequelize.authenticate();
    console.log('✅ Database connected');
}
