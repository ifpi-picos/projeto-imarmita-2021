require('dotenv').config({
  path:
    process.env.NODE_ENV === 'test'
      ? 'src/config/env/.env.test'
      : 'src/config/env/.env'
})

module.exports = {
  dialect: process.env.DATABASE_DIALECT || 'postgres',
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 5432,
  logging: !!Number(process.env.LOGGING),
  define: {
    timestamps: true,
    underscored: false
  }
}
