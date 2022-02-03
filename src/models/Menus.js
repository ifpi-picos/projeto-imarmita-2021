'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here 
      this.belongsTo (models.Users, {
        foreignKey: 'idUser',
        as: 'idCompany',
        onDelete: 'cascade',
      
      })

    }
  };
  Menus.init({
    week_day: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL(8, 2)
  }, {
    sequelize,
    modelName: 'Menus',
  });
  return Menus;
};