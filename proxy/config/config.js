require('dotenv').config();

module.exports = {
  development: {
    "dialect": "mysql",
    "url": process.env.DATABASE_DEV_URL
  },

  production: {
    "dialect": "mysql",
    "url": process.env.DATABASE_PROD_URL
  },
};