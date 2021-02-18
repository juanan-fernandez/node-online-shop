const mysql = require('mysql2');

const cnnPool = mysql.createPool({
   host: process.env.SQL_HOST,
   user: process.env.SQL_USER,
   database: process.env.SQL_DATABASE,
   password: process.env.SQL_PASSWORD
});

module.exports = cnnPool.promise();