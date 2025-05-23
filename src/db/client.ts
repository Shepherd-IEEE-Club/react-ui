import { Sequelize } from 'sequelize';

// Pull settings from env vars so you can swap DBs by changing .env
export const sequelize = new Sequelize({
    dialect: (process.env.DB_DIALECT ?? 'sqlite') as any,  // 'sqlite' | 'postgres' | 'mysql' …
    storage: process.env.DB_FILE ?? '../data/postmarks.db',
    // host:    process.env.DB_HOST,
    // database:process.env.DB_NAME,
    // username:process.env.DB_USER,
    // password:process.env.DB_PASS,
    logging:  true,
});

// Helper so server.ts can verify the connection once
export async function initDb() {
    await sequelize.authenticate();
    console.log('✅ Database connected');
}
