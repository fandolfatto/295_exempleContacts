import mysql from 'mysql2/promise';

// represents the connection to the DB
// it is shared by all the fonctions
const poolConn = mysql.createPool({
    host: "localhost",
    user: "root", //use another user
    password: "P@ssw0rd",
    port: 3308, //usually we use the 3306 port
    database: "app_contacts",
})

// The db object groups together the different operations our application can perform on the database
const db = {

    getAllContacts: async () => {
        // await waits for the query to finish before continuing
        // this function, but does not block the Node.js server
        const [rows] = await poolConn.execute('SELECT * FROM contacts');
        return rows;
    },

    getContactById: async ( id) => {
        //this syntax (prepared statement, parameters used in the query) prevents from SQL injections
        const [rows] = await poolConn.execute('SELECT * FROM contacts WHERE id = ?', [id]);
        return rows[0];
    },

    createContact: async ( {name, email}) => {
        const [result] = await poolConn.execute(
            'INSERT INTO contacts (name, email) VALUES (?, ?)',
            [name, email]
        );
        return {id: result.insertId, name, email};
    },

    updateContact: async (id, {name, email}) => {
        await poolConn.execute(
            'UPDATE contacts SET name = ?, email = ? WHERE id = ?',
            [name, email, id]
        );
        return {id, name, email};
    },

    deleteContact: async (id) => {
        await poolConn.execute('DELETE FROM contacts WHERE id = ?', [id]);
        return {success: true};
    }
}

export { db }