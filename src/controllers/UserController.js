const { Users } = require('../models')

module.exports = {
  async store (req, res) {
    const { phone, name, address, birthDate, email } = req.body
    const user = await Users.create({ phone, name, address, birthDate, email })
    return res.json(user)
  }
}
