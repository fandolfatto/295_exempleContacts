import mysql from 'mysql2/promise';

// use .env to hide this information
const pool = mysql.createPool({
    host: "localhost",
    user: "root", //use another user
    password: "P@ssw0rd",
    port: 3308, //usually we use the 3306 port
    database: "app_contacts",
});

const db = {

    getAllContacts: async () => {
        try {
            // await waits until the query is finished before continuing
            // the code calling getAllContacts() must also use await
            // if it doesn't, it will continue without waiting for getAllContacts()
            const [rows] = await pool.query('SELECT * FROM contact');
            return rows;
        } catch(err) {
            console.error(err);
            throw err;
        }

    },

    getContactById: async ( id) => {
        //this syntax (prepared statement, parameters used in the query) prevents from SQL injections
        try {
            const [rows] = await pool.query('SELECT * FROM contacts WHERE id = ?', [id]);
            return rows[0];
        } catch(err) {
            console.error(err);
            throw err;
        }
    },

    createContact: async ( {name, email}) => {
        try {
            const [result] = await pool.query(
                'INSERT INTO contacts (name, email) VALUES (?, ?)',
                [name, email]);
            return {id: result.insertId, name, email};
        } catch(err) {
            console.error(err);
            throw err;
        }
    },

    updateContact: async (id, {name, email}) => {
        try {
            const [result] = await pool.query(
                'UPDATE contacts SET name = ?, email = ? WHERE id = ?',
                [name, email, id]
            );
            return result.affectedRows;
        } catch(err) {
            console.error(err);
            throw err;
        }
    },

    deleteContact: async (id) => {
        try {
            const [result] = await pool.query('DELETE FROM contacts WHERE id = ?', [id]);
            if (result.affectedRows > 0) {
                return {success: true};
            } else {
                return {success: false};
            }
        } catch(err) {
            console.error(err);
            throw err;
        }
    },

}

export { db }