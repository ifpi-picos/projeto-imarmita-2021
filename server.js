const app = require('./src/app')
const { sequelize } = require('./src/models')
const { PORT } = process.env

// Starting Server

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Application is online at http://localhost:${PORT}/`)
  })
})
