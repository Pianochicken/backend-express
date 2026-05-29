import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

import 'reflect-metadata';
import { dataSource } from '../app-data-source.js';
import { UserService } from '../service/userService.js';
import { CreateUserModel } from '../model/userModel.js';

async function main() {
    const name = process.env.ADMIN_NAME || 'admin'
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'change_me';

    await dataSource.initialize();

    const userService = new UserService();

    const user: CreateUserModel = { 
        name, 
        email,
        password,
    };
    
    try {
        await userService.createUser(user);
        console.log(`Seeded admin user: ${email}`);
    } catch (error: any) {
        if (error.code === '23505') {
            console.log(`Admin user ${email} already exists. Skipping seed.`);
        } else {
            throw error;
        }
    }
    await dataSource.destroy();
}

main().catch(async (err) => {
    console.error('Seed failed:', err);
    try { await dataSource.destroy(); } catch { }
    process.exit(1);
});