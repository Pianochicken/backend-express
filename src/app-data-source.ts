import 'dotenv/config';
import { DataSource } from "typeorm";
import path from 'path';

export const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "postgres",
    // For production, entities should point to .js files in the dist folder.
    // For development, it can point to .ts files in the src folder.
    entities: [
        path.join(__dirname, './entity/*.entity.{js,ts}')
    ],
    // synchronize: true should only be used in development.
    // It can cause data loss in production.
    synchronize: process.env.NODE_ENV === 'development'
});