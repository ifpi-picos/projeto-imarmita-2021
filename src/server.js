const express = require('express')
const routes = require('./routes')
const connection = require('./config/database')



const app = express()
const PORT = 8080


// Body-parser integrado
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Database

// connection
//   .authenticate()
//   .then(() => {
//     console.log('Conexão com BD bem-sucedida!')
//   })
//   .catch(error => {
//     console.log(error)
//   })

// ROTAS
app.use('/', routes)
// app.use('/users', usersController)
// app.use('/caterers', caterersController)



// Starting Server

app.listen(PORT, () => {
  console.log('O servidor está funcionando! Porta alocada: ', PORT)
})
