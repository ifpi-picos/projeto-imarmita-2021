'use strict';

const { type } = require("express/lib/response");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Menus', {
      id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      week_day: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      price: {
        allowNull: false,
        type: Sequelize.DECIMAL(8, 2)
      },
      idUser: {
        allowNull: false,
        type: Sequelize.INTEGER, 
        references: { model: 'Users', key: 'id'},
        onDelete: 'CASCADE', 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      
    

    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Menus')
  }
};
