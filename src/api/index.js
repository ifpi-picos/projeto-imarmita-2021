const express = require('express')
const router = express.Router()

const userRoutes = require('./users')


// ROTA DE HOMEPAGE
router.get('/', (req, res) => {
  res.status(200).send('<h1 style="text-align: center">HOMEPAGE</h1>')
})



// ROTAS INDEXADAS
router.use('/users', userRoutes)


module.exports = router