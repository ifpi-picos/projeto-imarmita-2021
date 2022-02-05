const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')

const SALT = 10

class Auth {
  constructor (User) {
    this.User = User
  }

  genToken (user) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })
    return token
  }

  async signIn (email, password) {
    const failedLoginMsg = 'Email e/ou senha inválidos'

    const user = await this.User.findOne({
      where: { email: email }
    })

    if (user === null) {
      throw new Error(failedLoginMsg)
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password)

    if (!passwordIsValid) {
      throw new Error(failedLoginMsg)
    }

    const token = this.genToken(user)
    const { id, name } = user
    return { token, userData: { id, name, email } }
  }

  async signUp (userDTO) {
    try {
      userDTO.password = bcrypt.hashSync(userDTO.password, SALT)
      const [user, created] = await this.User.findOrCreate({
        where: {
          [Op.or]: [{ phone: userDTO.phone }, { email: userDTO.email }]
        },
        defaults: userDTO
      })
      if (created) {
        const createdUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profileType: user.profileType,
          bioDescription: user.bioDescription
        }

        return createdUser
      } else {
        throw new Error('Usuário já cadastrado')
      }
    } catch ({ message }) {
      throw new Error(message)
    }
  }
}

module.exports = Auth