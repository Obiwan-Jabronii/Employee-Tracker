const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Itsatrap69!',
    database: 'workplace_db'
  },
  console.log('Connected to the workplace database')
);

module.exports = db;