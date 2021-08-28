import fs from 'fs';

import dotenv from 'dotenv';
dotenv.config({path:'../.env'});

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: {
        ca: fs.readFileSync('./certs/cc-ca.crt.txt').toString()
    }
};

export default config;