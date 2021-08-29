import fs from 'fs';

import dotenv from 'dotenv';
// dotenv.config({path:'../.env'});
dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true,
        // ca:fs.readFileSync('cc-ca.crt.txt').toString()
        ca: process.env.check
    }
};

export default config;