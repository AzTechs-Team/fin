import pg from 'pg';
import config from './config.js';

export const query = async(sqlCmd) => {
    const pool = new pg.Pool(config);
    try {
        return await pool.query(sqlCmd);
    } catch (err){
        // console.log(err.stack, "Error!");
        return false;
    }
}

// console.log(await query('SELECT id, balance FROM account;'));
