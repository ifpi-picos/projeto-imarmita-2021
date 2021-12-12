import express from 'express'
import connection from './database/database.js'

import usersController from './controllers/UsersController.js'
import caterersController from './controllers/CaterersController.js'
import testroutes from './__TestRoutes/TestRoute.js'

const app = express()
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
app.use('/TESTROUTES', testroutes)
app.use('/users', usersController)
app.use('/caterers', caterersController)

app.get('/', (req, res) => {
  res.send('HOMEPAGE')
})

// Starting Server

app.listen(PORT, () => {
  console.log('O servidor está funcionando! Porta alocada: ', PORT)
})
