import express from 'express'
import { validationResult, check } from 'express-validator'
import Caterer from '../modules/Caterer.js'

const router = express.Router()

router.get('/new', (req,res)=>{
  res.send('ROTA PARA FORMULÁRIO DE NOVO FORNECEDOR')
})

router.post(
  '/admin/save',
  check('name', 'Nome inválido!')
    .not()
    .notEmpty()
    .isAlpha('pt-BR', {ignore: ' '}),
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
      const emailExists = await Caterer.findAll({
        where: { email }
      })
      if (emailExists.length) {
        return res.status(400).json({ msg: 'Email já utilizado.' })
      }
      await Caterer.create({
        name: name.toUpperCase(),
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

export default router
