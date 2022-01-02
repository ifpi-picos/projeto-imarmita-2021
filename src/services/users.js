const { Op } = require('sequelize/dist')

class UsersService {
  constructor (User) {
    this.User = User
  }

  async get () {
    try {
      const { rows, count } = await this.User.findAndCountAll({
        attributes: ['id', 'name', 'phone', 'email']
      })
      return { users: rows, count }
    } catch (error) {
      throw new Error(error)
    }
  }

  async create (UserDTO) {
    try {
      const [user, created] = await this.User.findOrCreate({
        where: {
          [Op.or]: [{ phone: UserDTO.phone }, { email: UserDTO.email }]
        },
        defaults: UserDTO
      })
      if (created) {
        return user
      } else {
        throw new Error('Usuário já cadastrado')
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async update (id, UserDTO) {
    try {
      const verifyUser = await this.User.findAll({
        where: {
          [Op.or]: [{ phone: UserDTO.phone }, { email: UserDTO.email }]
        }
      })

      if (verifyUser[0]) {
        throw new Error('Email e/ou telefone já cadastrados!')
      }


      const verifyPassword = await this.User.findByPk(id, {
        attributes: ['password']
      })

      if (UserDTO.password === verifyPassword.password) {
        throw new Error('Senha não atualizada')
      }

      const Response = await this.User.update(UserDTO, {
        where: { id }
      })

      if (!Response[0]) {
        throw new Error('Usuário não existe! Informe um ID de usuário válido')
      }

      const user = await this.User.findByPk(id, {
        attributes: ['id', 'phone', 'name', 'birthDate', 'email']
      })

      return { message: 'Usuário atualizado com sucesso', data: user }
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async delete (id) {
    try {
      const userDeleted = await this.User.destroy({
        where: { id }
      })
      if (!userDeleted) {
        throw new Error('Usuário não existe!')
      }
      return { message: 'Usuário apagado com sucesso!' }

    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = UsersService
