const config = require("./config");

module.exports = {
  development: {
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    host: config.DB_HOSTNAME,
    port: config.DB_PORT || "3306",
    dialect: config.DB_DIALECT || "mariadb",
    dialectOptions: {
      timezone: config.DB_TIMEZONE
    },
    url: config.DATABASE_URL
  },
  test: {
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    host: config.DB_HOSTNAME,
    port: config.DB_PORT || "3306",
    dialect: config.DB_DIALECT || "mariadb",
    dialectOptions: {
      timezone: config.DB_TIMEZONE
    },
    url: config.DATABASE_URL
  },
  production: {
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    host: config.DB_HOSTNAME,
    port: config.DB_PORT,
    dialect: config.DB_DIALECT,
    dialectOptions: {
      timezone: config.DB_TIMEZONE
    },
    url: config.DATABASE_URL
  }
};
