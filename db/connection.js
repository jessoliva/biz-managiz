// import mysql2 package
const mysql = require('mysql2');

// connects the application to the MySQL database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: 'root',
        database: 'management_db'
    },
    console.log('Connected to the election database.')
);

module.exports = db;