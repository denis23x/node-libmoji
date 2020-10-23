const env = require('dotenv').config({
  path: '../../.env'
});

module.exports = {
  development: {
    username: process.env.DB_DEV_USERNAME,
    password: process.env.DB_DEV_PASSWORD,
    database: process.env.DB_DEV_DATABASE,
    host: process.env.DB_DEV_HOST,
    port: process.env.DB_DEV_PORT,
    dialect: process.env.DB_DEV_DIALECT,
    logging: !!+process.env.DB_DEV_LOGGING
  }
};
