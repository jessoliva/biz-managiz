const inquirer = require('inquirer');
// connect to database
const db = require('../db/connection');
const cTable = require('console.table');



async function displayDepartments() {

    const sql = `SELECT * FROM departments;`

    const departments = await 
    db.promise()
    .query(sql)
    .then(([rows,fields]) => {
        console.log(rows);
    });
};

module.exports = { displayDepartments };