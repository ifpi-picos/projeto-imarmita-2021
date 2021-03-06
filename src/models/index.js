'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const sequelizeInstance = require('../config/sequelize')

const db = {}

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelizeInstance,
      Sequelize.DataTypes
    )
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelizeInstance
db.Sequelize = Sequelize

module.exports = db
