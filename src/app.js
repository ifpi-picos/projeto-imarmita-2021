const express = require('express')
const routes = require('./api')
const auth = require('./middleware/auth')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const { API_BASE } = process.env

const app = express()

app.get('/', (req, res) => res.redirect(`${API_BASE}`))

// Parsers
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // token in cookie
    methods: 'GET,PUT,POST,OPTIONS, DELETE',
    // allowedHeaders: 'Accept, Content-Type, Authorization'
  })
)

// ROTAS
app.all(`${process.env.API_BASE}*`, (req, res, next) => {
  const publicRoutes = [`${process.env.API_BASE}`, `${process.env.API_BASE}/auth/signup`, `${process.env.API_BASE}/auth/signin`, ]

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

app.use(process.env.API_BASE, routes)

module.exports = app
