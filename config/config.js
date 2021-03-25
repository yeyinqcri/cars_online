require("dotenv").config();
module.exports = {
  PORT: process.env.PORT,
  MONGOURI: process.env.MONGOURI,
  NODE_ENV: process.env.NODE_ENV,
  CLIENT_SECRET_ID:process.env.CLIENT_SECRET_ID,
  CLIENT_ID:process.env.CLIENT_ID,
};
