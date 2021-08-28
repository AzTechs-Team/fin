import pg from 'pg';
import config from '../config.js';

export const query = async(sqlCmd) => {
    const pool = new pg.Pool(config);
    try {
        return await pool.query(sqlCmd);
    } catch (err){
        // console.log(err.stack, "Error!");
        return false;
    }
}

// const id = 3
// const b = 'username'
// console.log(await query(`INSERT INTO players VALUES('${ id }','${ b }',0,0);`));
