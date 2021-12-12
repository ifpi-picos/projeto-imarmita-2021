import Sequelize from 'sequelize'
import connection from '../database/database.js'

const User = connection.define('users', {
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
// User.sync({ force: true })

export default User
