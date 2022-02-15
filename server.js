const app = require('./src/app')
const config = require('./src/config')

const { sequelize } = require('./src/models')

// Starting Server
sequelize.sync().then(() => {
  app.listen(config.PORT, () => {
    console.log(`Application is online at http://localhost:${config.PORT}${config.API_BASE}`)
  })
})
