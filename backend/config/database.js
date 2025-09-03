const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;
let db = {};

try {
  sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
      host: process.env.POSTGRES_HOST,
      dialect: 'postgres',
      port: process.env.POSTGRES_PORT,
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  // Import models
  db.Ticket = require('../models/Ticket')(sequelize);

  console.log('PostgreSQL connection initialized');
} catch (error) {
  console.log('PostgreSQL connection could not be established. Running in limited mode.');
  db.Sequelize = Sequelize;
  db.sequelize = null;
  db.Ticket = null;
}

module.exports = db;
