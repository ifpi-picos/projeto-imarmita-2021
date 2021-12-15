const express = require('express')
const routes = require('./src/api')
const { sequelize } = require('./src/models')

const app = express()
const {PORT} = process.env

// Body-parser integrado
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// ROTAS
app.use('/', routes)

// Starting Server

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Aplication is online at http://localhost:${PORT}/`)
  })
})
