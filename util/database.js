const Sequelize = require('sequelize');

const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.SQL_DATABASE, process.env.SQL_USER, process.env.SQL_PASSWORD, {
	dialect: 'mysql',
	host: process.env.SQL_HOST,
});

module.exports = sequelize;
