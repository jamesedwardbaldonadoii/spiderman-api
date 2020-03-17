const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  appName: process.env.APP_NAME,
  nodeEnv: process.env.NODE_ENV,
  host: process.env.APP_HOST,
  port: process.env.APP_PORT,
  mongoURI: `${process.env.DB_HOST}/${process.env.DB_NAME}`,
  tokenSecret: process.env.TOKEN_ACCESS_SECRET,
  tokenLife: process.env.TOKEN_REFRESH_EXP,
  iss: process.env.JWT_ISS,
  refreshTokenSecret: process.env.TOKEN_REFRESH_SECRET,
  refreshTokenLife: process.env.TOKEN_ACCESS_EXP
}
