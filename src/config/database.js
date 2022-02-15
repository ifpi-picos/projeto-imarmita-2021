const config = require('./index.js')
const sslSuport = {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
}

module.exports = {
  dialect: 'postgres',
  username: config.DATABASE_USER,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE_DB,
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  ...(process.env.NODE_ENV === 'production' && { dialectOptions: sslSuport })
}
