import Sequelize from 'sequelize'
import connection from '../database/database.js'

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

export default Caterer
