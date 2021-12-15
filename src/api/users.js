const express = require('express')
const { validationResult, check } = require('express-validator')

const { Users } = require('../models')
const UsersService = require('../services/users')
const usersService = new UsersService(Users)

const router = express.Router()

router.get('/admin/new', (req, res) => {
  res.send('ROUTE FOR NEW USER FORM')
})

router.get('/admin/list', async (req, res) => {
  try {
    const { users, count } = await usersService.get()
    res.json({ message: `${count} usuários encontrados!`, data: users })
  } catch ({ msg }) {
    res.status(400).json({ error: { msg } })
  }
})

router.post(
  '/admin/save',
  check('phone', 'Telefone inválido')
    .not()
    .notEmpty()
    .isNumeric()
    .isMobilePhone('pt-BR'),
  check('name', 'Nome inválido!')
    .not()
    .notEmpty()
    .isAlpha('pt-BR', { ignore: ' ' }),
  check('birthDate', 'Data inválida')
    .not()
    .notEmpty()
    .isISO8601()
    .isBefore(),
  check('email', 'Email inválido!')
    .not()
    .notEmpty()
    .isEmail(),
  check('password', 'Senha deve conter pelo menos 8 caracteres.')
    .not()
    .notEmpty()
    .isLength({ min: 8 }),

  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg })
      }

      const { phone, name, birthDate, email, password } = req.body
      const user = await usersService.create({
        phone,
        name,
        birthDate,
        email,
        password
      })
      res
        .status(201)
        .json({ message: 'Usuário cadastrado com sucesso', data: user })
    } catch ({ message }) {
      res.status(400).json({ error: { message } })
    }
  }
)

module.exports = router
