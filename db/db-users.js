import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import {poolConn} from "./db-contacts.js";

const db_users = {

    createUser: async (username, password) => {
        const hashPwd = await bcrypt.hash(password, 10);
        const [result] = await poolConn.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashPwd]);
        return {id: result.insertId, username};
    },

    getUserByUserName: async (login) => {
        //this syntax (prepared statement, parameters used in the query) prevents from SQL injections
        const [rows] = await poolConn.execute('SELECT * FROM users WHERE username = ?', [login]);
        return rows[0];
    }
}

export { db_users }