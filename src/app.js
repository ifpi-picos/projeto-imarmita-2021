const express = require('express')
const routes = require('./api')

const app = express()

// Body-parser integrado
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// ROTAS
app.use('/', routes)

module.exports = app