const express = require('express')
const { validationResult, param, body } = require('express-validator')

const { Users } = require('../models')
const UsersService = require('../services/users')
const usersService = new UsersService(Users)

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const filter = req.body.profileType
    const { users, count } = await usersService.getAllUsers(req.userId, filter)
    return res
      .json({
        message: `${count} usuários encontrados!`,
        rows: count,
        data: users
      })
      .status(200)
  } catch ({ message }) {
    return res.status(401).json({ message })
  }
})

router.get('/me', async (req, res) => {
  try {
    const user = await usersService.returnUser(req.userId)
    return res.status(200).json({ user })
  } catch ({ message }) {
    return res.status(401).json({ message })
  }
})

router.get('/companies', async (req, res) => {
  try {
    const { users, count } = await usersService.getCompanies(req.userId)
    return res.status(200).json({
      message: `${count} fornecedores encontrados!`,
      data: users
    })
  } catch ({ message }) {
    return res.status(401).json({ message })
  }
})

router.put(
  '/:id',
  param('id', 'Informe um ID válido').isInt({ min: 1 }),
  body('name', 'Nome inválido!')
    .trim()
    .notEmpty()
    .isAlpha('pt-BR', { ignore: ' ' }),
  body('email', 'Email inválido!')
    .trim()
    .notEmpty()
    .isEmail(),
  body('phone', 'Telefone inválido')
    .trim()
    .notEmpty()
    .isNumeric()
    .isMobilePhone('pt-BR'),
  body('password', 'Senha deve conter pelo menos 8 caracteres.')
    .trim()
    .notEmpty()
    .isLength({ min: 8 }),

  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg })
      }

      const { id } = req.params
      const actorId = req.userId
      const { name, email, phone, bioDescription, password } = req.body
      const user = await usersService.update(id, actorId, {
        name,
        email,
        phone,
        bioDescription,
        password
      })
      return res.status(200).json(user)
    } catch ({ message }) {
      return res.status(401).json({ message })
    }
  }
)

router.delete(
  '/:id',
  param('id', 'Informe um ID válido').isInt({ min: 1 }),

  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg })
      }
      const { id } = req.params
      const actorId = req.userId

      const user = await usersService.delete(id, actorId)
      return res.status(200).json(user)
    } catch ({ message }) {
      return res.status(401).json({ message })
    }
  }
)

module.exports = router
