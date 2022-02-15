const express = require('express')
require('dotenv').config()
const routes = require('./api')
const auth = require('./middleware/auth')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')
const config = require('./config')


const app = express(config.API_BASE)

app.get('/', (req, res) => res.redirect(`${API_BASE}`))

// Uses
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

// ROTAS
app.all(`${config.API_BASE}*`, (req, res, next) => {
  const publicRoutes = [
    `${config.API_BASE}`,
    `${config.API_BASE}/auth/signup`,
    `${config.API_BASE}/auth/signin`
  ]

  for (let i = 0; i < publicRoutes.length; i++) {
    if (req.path === publicRoutes[i]) {
      return next()
    }
  }

  auth(req, res, next)
})

app.get('/', (req, res) => {
  res.status(200).send('<h1 style="text-align: center">App Online!</h1>')
})

app.use(config.API_BASE, routes)

module.exports = app
