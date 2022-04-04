const inquirer = require('inquirer');
// connect to database
const db = require('../db/connection');
// const cTable = require('console.table');
const app = require('../app');

async function displayAnimals() {

    const sql = `SELECT * FROM animals;`

    const animals = await 
    db.promise()
    .query(sql)
    .then(([rows,fields]) => {
        console.log(`================= Animals Table =================
        `);
        console.table(rows);
    });

    return app();
};

module.exports = { displayAnimals };