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
}

module.exports = UsersService
