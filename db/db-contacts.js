import mysql from 'mysql2/promise';

// represents the connection to the DB
// it is shared by all the fonctions
process.loadEnvFile();

const poolConn = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

const db = {

    getAllContacts: async () => {
        try {
            //the getAllContacts function waits until the query is finished to execute
            //if there is some code after the call of this function, it will be executed without waiting the execution of this function
            const [rows] = await poolConn.execute('SELECT * FROM contacts');
            return rows;
        } catch(err) {
            console.log(err);
            throw err;
        }
    },

    getContactById: async ( id) => {
        //this syntax (prepared statement, parameters used in the query) prevents from SQL injections
        try {
            const [rows] = await poolConn.execute('SELECT * FROM contacts WHERE id = ?', [id]);
            return rows[0];
        } catch(err) {
            console.log(err);
            throw err;
        }
    },

    createContact: async ( {name, email}) => {
        try {
            const [result] = await poolConn.execute(
                'INSERT INTO contacts (name, email) VALUES (?, ?)',
                [name, email]);
            return {id: result.insertId, name, email};
        } catch(err) {
            console.log(err);
            throw err;
        }
    },

    updateContact: async (id, {name, email}) => {
        try {
            const [result] = await poolConn.execute(
                'UPDATE contacts SET name = ?, email = ? WHERE id = ?',
                [name, email, id]
            );
            return result.affectedRows;
        } catch(err) {
            console.log(err);
            throw err;
        }
    },

    deleteContact: async (id) => {
        try {
            const [result] = await poolConn.execute('DELETE FROM contacts WHERE id = ?', [id]);
            if (result.affectedRows > 0) {
                return {success: true};
            } else {
                return {success: false};
            }
        } catch(err) {
            console.log(err);
            throw err;
        }
    }
}

export { db }