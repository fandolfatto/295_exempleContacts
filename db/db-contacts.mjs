import mysql from 'mysql2/promise';

const db = {


    connectToDatabase :async () => {
        const con = mysql.createConnection({
            host: "localhost",
            user: "root", //use another user
            password: "P@ssw0rd",
            port: 3308, //usually we use the 3306 port
            database: "app_contacts",
        });
        return con;
    },

    getAllContacts: async () => {
        //the getAllContacts function waits until the query is finished to execute
        //if there is some code after the call of this function, it will be executed without waiting the execution of this function
        let con;
        try {
            con = await db.connectToDatabase();
            const [rows] = await con.query('SELECT * FROM contacts');
            return rows;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    getContactById: async ( id) => {
        let con
        try {
            con = await db.connectToDatabase();
            //this syntax (prepared statement, parameters used in the query) prevents from SQL injections
            const [rows] = await con.query('SELECT * FROM contacts WHERE id = ?', [id]);
            return rows[0];
        }
        finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    createContact: async ( {name, email}) => {
        let con;
        try {
            con = await db.connectToDatabase();
            const [result] = await con.query(
                'INSERT INTO contacts (name, email) VALUES (?, ?)',
                [name, email]
            );
            return {id: result.insertId, name, email};
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    updateContact: async (id, {name, email}) => {
        let con;
        try {
            con = await db.connectToDatabase();
            await con.query(
                'UPDATE contacts SET name = ?, email = ? WHERE id = ?',
                [name, email, id]
            );
            return {id, name, email};
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    deleteContact: async (id) => {
        let con;
        try {
            con = await db.connectToDatabase();
            await con.query('DELETE FROM contacts WHERE id = ?', [id]);
            return {success: true};
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
}

export { db }