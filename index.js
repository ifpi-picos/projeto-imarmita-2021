const express = require('express')
const app = express()


const ordersController = require('./controllers/OrdersController')
const caterersController = require('./controllers/CaterersController')

const PORT = 3000

// Body-parser integrado
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// ROTAS
// app.use('/', UsersController)
app.use('/', caterersController)
app.use('/', ordersController)

app.get('/', (req, res) => {
  res.send('ROTA INDEX')
})

app.listen(PORT, () => {
  console.log('O servidor está funcionando! Porta alocada: ', PORT)
})
