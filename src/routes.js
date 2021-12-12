const express = require('express')

const UserController = require('./controllers/UserController')

const routes = express.Router()

routes.get('/', (req, res) => {
  res.send('HOMEPAGE')
})

routes.post('/users', UserController.store)

module.exports = routes
