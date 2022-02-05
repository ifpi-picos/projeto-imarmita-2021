const { Op } = require('sequelize')
const bcrypt = require('bcrypt')
const {
  ADMIN_USER,
  COMPANY_USER,
  CUSTOMER_USER
} = require('../enumerators/profileTypes')

const SALT = 10
class UsersService {
  constructor (User) {
    this.User = User
    this.order = [['name', 'ASC']]
  }

  async getUserById (userId) {
    try {
      const user = await this.User.findByPk(userId)
      return user
    } catch (error) {
      throw new Error(error)
    }
  }

  async getAllUsers (actorId, filter) {
    try {
      const actor = await this.getUserById(actorId)
      if (actor.profileType !== ADMIN_USER) {
        throw new Error('Usuário não autorizado!')
      }

      const attributes = ['id', 'name', 'email', 'phone', 'profileType']
      if (filter === COMPANY_USER) {
        attributes.push('bioDescription')
      }

      const condition = {
        attributes,
        order: this.order
      }

      if (filter !== 0) {
        condition.where = { profileType: filter }
      }

      const { rows, count } = await this.User.findAndCountAll(condition)
      return { users: rows, count }
    } catch (error) {
      throw new Error(error)
    }
  }

  async getCompanies (actorId) {
    try {
      const actor = await this.getUserById(actorId)
      if (actor.profileType !== CUSTOMER_USER) {
        throw new Error('Usuário não autorizado!')
      }
      const { rows, count } = await this.User.findAndCountAll({
        where: {
          profileType: COMPANY_USER
        },
        attributes: ['id', 'name', 'email', 'phone', 'bioDescription'],
        order: this.order
      })
      return { users: rows, count }
    } catch (error) {
      throw new Error(error)
    }
  }

  async update (id, actorId, userDTO) {
    try {
      // CHECKS IF USER EXISTS
      const userToUpdate = await this.User.findByPk(id)
      if (!userToUpdate) {
        throw new Error('Usuário não existe! Informe um ID de usuário válido')
      }

      const actor = await this.getUserById(actorId)
      if (actor.id !== userToUpdate.id) {
        throw new Error('Usuário não autorizado!')
      }

      // VERIFY IF UNIQUE DATA IS REPEATED
      const verifyUser = await this.User.findOne({
        where: {
          [Op.or]: [{ phone: userDTO.phone }, { email: userDTO.email }]
        }
      })

      if (verifyUser && verifyUser.id != id) {
        throw new Error('Email e/ou telefone já cadastrados!')
      }

      // SETS FIELDS TO UPDATE ACCORDING TO 'PROFILE TYPE'
      const fields = ['name', 'email', 'phone', 'password']

      if (userToUpdate.profileType === COMPANY_USER) {
        if (!userDTO.bioDescription) {
          throw new Error('Insira uma descrição para sua empresa.')
        }
        fields.push('bioDescription')
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
  async delete (id, actorId) {
    try {
      const actor = await this.User.findByPk(actorId)
      if (actor.id != id) {
        throw new Error('Usuário não autorizado!')
      }

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
