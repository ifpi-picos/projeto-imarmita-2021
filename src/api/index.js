const express = require('express')
const router = express.Router()

const authRoutes = require('./auth')
const userRoutes = require('./users')

router.get('/', (req, res) => {
  res.status(200).send('<h1 style="text-align: center">App Online!</h1>')
})

// ROTAS INDEXADAS
router.use('/auth', authRoutes)
router.use('/users', userRoutes)

module.exports = router
