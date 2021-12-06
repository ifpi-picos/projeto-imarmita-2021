const express = require('express')
const User = require('../modules/User')
const { validationResult, check } = require('express-validator')
const router = express.Router()

router.get('/', async (req, res) => {  // ROTA DE TESTE: VERIFICA LISTA DE USUARIOS CADASTRADOS (A SER APAGADO)
  try {
    const users = await User.findAll()
    res.status(200).json(users)
  } catch (error) {
    console.log(error)
  }
})

router.get('/new', (req,res)=>{
  res.send('ROTA PARA FORMULÁRIO DE NOVO USUÁRIO')
})

router.post(
  '/admin/save',
  check('name', 'Nome inválido!')
    .not()
    .notEmpty()
    .isAlpha(),
  check('email', 'Email inválido!')
    .not()
    .notEmpty()
    .isEmail(),
  check('password', 'Senha deve conter entre 6 e 20 caracteres.')
    .not()
    .notEmpty()
    .isLength({ min: 6, max: 20 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()[0].msg })
    }

    const { name, email, password } = req.body

    try {
      const emailExists = await User.findAll({
        where: { email }
      })
      if (emailExists.length) {
        return res.status(400).json({ msg: 'Email já utilizado.' })
      }
      await User.create({
        name,
        email,
        password
      })
      return res.status(201).json({
        msg: 'Usuário adicionado com sucesso.'
      })
    } catch (error) {
      console.log(error)
    }
  }
)

module.exports = router
