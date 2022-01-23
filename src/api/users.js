const express = require('express')
const { validationResult, param, body, check } = require('express-validator')

const { Users } = require('../models')
const UsersService = require('../services/users')
const usersService = new UsersService(Users)

const router = express.Router()

router.get('/new', (req, res) => {
  res.send('ROUTE FOR NEW USER FORM')
})

router.get('/customers', async (req, res) => {
  try {
    const { users, count } = await usersService.getCustomers()
    res.json({ message: `${count} clientes encontrados!`, data: users })
  } catch ({ msg }) {
    res.status(400).json({ error: { msg } })
  }
})

router.get('/companies', async (req, res) => {
  try {
    const { users, count } = await usersService.getCompanies()
    res.json({ message: `${count} fornecedores encontrados!`, data: users })
  } catch ({ msg }) {
    res.status(400).json({ error: { msg } })
  }
})

router.post(
  '/',
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
  body('profileType', 'profileType inválido!')
    .isInt()
    .isIn([1, 2]),
  body(
    'bioDescription',
    'Adicione a descrição para a empresa, incluindo horário de funcionamento'
  )
    .if(
      body('profileType').custom((value, { req }) => {
        if (req.body.profileType == 1) {
          return true
        }
      })
    )
    .notEmpty()
    .isLength({ max: 150 }),
  body('password', 'Senha deve conter pelo menos 8 caracteres.')
    .trim()
    .notEmpty()
    .isLength({ min: 8 }),

  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg })
      }

      const {
        name,
        email,
        phone,
        bioDescription,
        password,
        profileType
      } = req.body
      const user = await usersService.create({
        name,
        email,
        phone,
        bioDescription,
        password,
        profileType
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
        return res.status(400).json({ error: errors.array()[0] })
      }

      const { id } = req.params
      const { name, email, phone, bioDescription, password } = req.body

      const user = await usersService.update(id, {
        name,
        email,
        phone,
        bioDescription,
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
  param('id', 'Informe um ID válido').isInt({ min: 1 }),

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
