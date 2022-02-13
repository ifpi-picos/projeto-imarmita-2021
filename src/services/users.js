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

  async getAllUsers (actorId, filter) {
    try {
      await this.checkPermission(actorId, ADMIN_USER)

      const attributes = ['id', 'name', 'email', 'phone', 'profileType']
      if ((filter == COMPANY_USER) || (filter == 0)) {
        attributes.push('bioDescription')
      }
      const condition = {
        attributes,
        order: this.order
      }
      if (filter != 0) {
        condition.where = { profileType: filter }
      }
      

      const { rows, count } = await this.User.findAndCountAll(condition)
      return { users: rows, count }
    } catch ({message}) {
      throw new Error(message)
    }
  }

  async getCompanies (actorId) {
    try {
      await this.checkPermission(actorId, CUSTOMER_USER)
      const { rows, count } = await this.User.findAndCountAll({
        where: {
          profileType: COMPANY_USER
        },
        attributes: ['id', 'name', 'email', 'phone', 'bioDescription'],
        order: this.order
      })
      return { users: rows, count }
    } catch ({message}) {
      throw new Error(message)
    }
  }

  async update (id, actorId, userDTO) {
    try {
      const userToUpdate = await this.userExists(id)

      // CHECK PERMISSIONS
      const actor = await this.User.findByPk(actorId)
      if (actor.id != id) {
        throw new Error('Usuário não autorizado!')
      }

      // VERIFY IF UNIQUE DATA IS REPEATED
      await this.isDataInUse(userDTO, id)

      // SETS FIELDS TO UPDATE ACCORDING TO 'PROFILE TYPE'
      const fields = ['name', 'email', 'phone', 'password']

      if (userToUpdate.profileType == COMPANY_USER) {
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
    } catch ({message}) {
      throw new Error(message)
    }
  }

  async delete (id, actorId) {
    try {
      await this.userExists(id)
      const actor = await this.User.findByPk(actorId)
      if (actor.id != id) {
        throw new Error('Usuário não autorizado!')
      }
      await this.User.destroy({
        where: { id }
      })
      return { message: 'Usuário apagado com sucesso!' }
    } catch ({message}) {
      throw new Error(message)
    }
  }

  async userExists (id) {
    const user = await this.User.findByPk(id)
    if (!user) {
      throw new Error('Usuário não existe!')
    }
    return user
  }

  async checkPermission (actorId, permission) {
    try {
      const actor = await this.User.findByPk(actorId)
      if (actor.profileType !== permission) {
        throw new Error('Usuário não autorizado!')
      }
      return true
    } catch ({message}) {
      throw new Error(message)
    }
  }

  async isDataInUse (userDTO, id) {
    try {
      const verifyUser = await this.User.findAll({
        where: {
          [Op.or]: [{ phone: userDTO.phone }, { email: userDTO.email }]
        }
      })
      verifyUser.forEach(user => {
        const equalPhone = user.phone == userDTO.phone
        const equalEmail = user.email == userDTO.email
        const idDif = user.id != id

        if ((equalPhone && idDif) | (equalEmail && idDif)) {
          throw new Error('Email e/ou telefone já cadastrados!')
        }
      })
      return false
    } catch ({message}) {
      throw new Error(message)
    }
  }
}

module.exports = UsersService
