const Sequelize = require('sequelize')
const connection = require('../database/database')

const Caterer = connection.define('caterers', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

// RESET TABLE
// Caterer.sync({ force: true })

module.exports = Caterer
