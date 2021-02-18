const mysql = require('mysql2');

const cnnPool = mysql.createPool({
   host: 'localhost',
   user: 'root',
   database: 'node-max-eshop',
   password: 'Kahun255-678526175'
});

module.exports = cnnPool.promise();