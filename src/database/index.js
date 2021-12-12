const Sequelize = require ('sequelize')
const dbConfig = require ('../config/database.js')

// const Users = require('../models/Users')

const connection = new Sequelize(dbConfig)

module.exports = connection