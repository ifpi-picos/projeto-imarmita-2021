const express = require('express')
const { validationResult, param, check } = require('express-validator')
const res = require('express/lib/response')

const { Users } = require('../models')
const UsersService = require('../services/users')
const usersService = new UsersService(Users)

const router = express.Router()

router.get('/new', (req, res) => {
  res.send('ROUTE FOR NEW USER FORM')
})

router.get('/', async (req, res) => {
  try {
    const { users, count } = await usersService.get()
    res.json({ message: `${count} usuários encontrados!`, data: users })
  } catch ({ msg }) {
    res.status(400).json({ error: { msg } })
  }
})

router.post(
  '/',
  check('phone', 'Telefone inválido')
    .trim()
    .notEmpty()
    .isNumeric()
    .isMobilePhone('pt-BR'),
  check('name', 'Nome inválido!')
    .trim()
    .notEmpty()
    .isAlpha('pt-BR', { ignore: ' ' }),
  check('birthDate', 'Data inválida')
    .trim()
    .notEmpty()
    .isISO8601()
    .withMessage('Formato de data inválido! [YYYY-MM-DD]')
    .isBefore(),
  check('email', 'Email inválido!')
    .trim()
    .notEmpty()
    .isEmail(),
  check('password', 'Senha deve conter pelo menos 8 caracteres.')
    .trim()
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

router.put(
  '/:id',
  check('phone', 'Telefone inválido')
    .trim()
    .notEmpty()
    .isNumeric()
    .isMobilePhone('pt-BR'),
  check('name', 'Nome inválido!')
    .trim()
    .notEmpty()
    .isAlpha('pt-BR', { ignore: ' ' }),
  check('birthDate', 'Data inválida')
    .trim()
    .notEmpty()
    .isISO8601()
    .withMessage('Formato de data inválido! [YYYY-MM-DD]')
    .isBefore(),
  check('email', 'Email inválido!')
    .trim()
    .notEmpty()
    .isEmail(),
  check('password', 'Senha deve conter pelo menos 8 caracteres.')
    .trim()
    .notEmpty()
    .isLength({ min: 8 }),

  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0] })
      }

      const { id } = req.params
      const { phone, name, birthDate, email, password } = req.body

      const user = await usersService.update(id, {
        phone,
        name,
        birthDate,
        email,
        password
      })
      res.status(200).json(user)
    } catch ({ message }) {
      res.status(400).json({ error: { message } })
    }
  }
)

router.delete(
  '/:id',
  param('id', 'informe um ID valido').isInt({ min: 1 }),

  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0] })
      }
      const { id } = req.params

      const user = await usersService.delete(id)
      res.status(200).json(user)
    } catch ({ message }) {
      res.status(400).json({ error: { message } })
    }
  }
)

module.exports = router
