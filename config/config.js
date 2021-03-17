const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  MONGOURI: process.env.MONGOURI,
  NODE_ENV:process.env.NODE_ENV,
};
