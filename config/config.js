require("dotenv").config();

module.exports = {
  NAME: process.env.NAME || "opennotes-api",
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  URL: process.env.BASE_URL || "http://localhost:3000",
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_HOSTNAME: process.env.DB_HOSTNAME,
  DB_PORT: process.env.DB_PORT || "3306",
  DB_DIALECT: process.env.DB_DIALECT || "mariadb",
  DB_TIMEZONE: process.env.DB_TIMEZONE || "Asia/Kathmandu",
  //JWT
  JWT_SECRET:
    process.env.JWT_SECRET ||
    "thisisasecretthatencryptsthejsonsokeepsecureprovidethesecretvalue",
  JWT_ISSUER: process.env.JWT_ISSUER || "https://fbk.com.np",
  JWT_EXP: process.env.JWT_EXP || "1d"
};
