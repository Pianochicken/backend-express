import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

import 'reflect-metadata';
import { dataSource } from '../app-data-source';
import { UserService } from '../service/userService';
import { CreateUserModel } from '../model/userModel';

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
    
    await userService.createUser(user);

    console.log(`Seeded admin user: ${email}`);
    await dataSource.destroy();
}

main().catch(async (err) => {
    console.error('Seed failed:', err);
    try { await dataSource.destroy(); } catch { }
    process.exit(1);
});