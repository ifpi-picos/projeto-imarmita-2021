const express = require('express')
const routes = require('./api')
const auth = require('./middleware/auth')


const app = express()

// Body-parser integrado
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// ROTAS
app.all('/*', (req, res, next) => {
  // const publicRoutes = process.env.PUBLIC_ROUTES
  const publicRoutes = ['/', '/auth/signup', '/auth/signin']

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

app.use('/', routes)

module.exports = app
