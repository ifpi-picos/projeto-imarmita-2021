const express = require('express')
const app = express()
const connection = require('./database/database')

const usersController = require('./controllers/UsersController')


const User = require('./modules/User')

const PORT = 8080

// Body-parser integrado
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Database

connection
  .authenticate()
  .then(() => {
    console.log('Conexão com BD bem-sucedida!')
  })
  .catch(error => {
    console.log(error)
  })

// ROTAS
app.use('/users', usersController)

app.get('/', (req, res) => {
  res.send('HOMEPAGE')
})

// Starting Server

app.listen(PORT, () => {
  console.log('O servidor está funcionando! Porta alocada: ', PORT)
})
