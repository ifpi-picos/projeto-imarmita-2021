const { Op } = require('sequelize')
const bcrypt = require('bcrypt')

const SALT = 10
class UsersService {
  constructor (User) {
    this.User = User
  }

  async getCustomers () {
    try {
      const { rows, count } = await this.User.findAndCountAll({
        where: {
          profileType: 2
        },
        attributes: ['id', 'name', 'email', 'phone']
      })
      return { users: rows, count }
    } catch (error) {
      throw new Error(error)
    }
  }

  async getCompanies () {
    try {
      const { rows, count } = await this.User.findAndCountAll({
        where: {
          profileType: 1
        },
        attributes: ['id', 'name', 'email', 'phone', 'bioDescription']
      })
      return { users: rows, count }
    } catch (error) {
      throw new Error(error)
    }
  }

  async update (id, userDTO) {
    try {
      // CHECKS IF USER EXISTS
      const user = await this.User.findByPk(id)
      if (!user) {
        throw new Error('Usuário não existe! Informe um ID de usuário válido')
      }

      // SETS FIELDS TO UPDATE ACCORDING TO 'PROFILE TYPE' & AVOIDS EMPTY DESCRIPTION FOR COMPANY USERS
      const fields = ['name', 'email', 'phone', 'password']

      if (user.profileType === 1) {
        fields.push('bioDescription')

        if (!userDTO.bioDescription) {
          throw new Error('Insira uma descrição para sua empresa.')
        }
      }

      // VERIFY IF UNIQUE DATA IS REPEATED
      const verifyUser = await this.User.findAll({
        where: {
          [Op.or]: [{ phone: userDTO.phone }, { email: userDTO.email }]
        }
      })

      if (verifyUser[0] && verifyUser[0].id != id) {
        throw new Error('Email e/ou telefone já cadastrados!')
      }

      // HASHES PASSWORD
      userDTO.password = bcrypt.hashSync(userDTO.password, SALT)

      // UPDATES USER
      await this.User.update(userDTO, {
        where: { id },
        fields
      })

      const updatedUser = await this.User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'phone', 'bioDescription']
      })

      return { message: 'Usuário atualizado com sucesso', data: updatedUser }
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
