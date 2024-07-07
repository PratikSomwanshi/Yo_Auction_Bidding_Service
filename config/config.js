const dotenv = require("dotenv");

dotenv.config();

// {
//     "development": {
//       "username": "root",
//       "password": "2002",
//       "database": "auction_db",
//       "host": "127.0.0.1",
//       "dialect": "mysql"
//     }
//   }

module.exports = {
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_DB_NAME: process.env.MYSQL_DB_NAME,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_PORT: process.env.MYSQL_PORT,
    MYSQL_DIALECT: "mysql",
};
