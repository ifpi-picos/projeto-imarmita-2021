import Sequelize from 'sequelize'
const connection = new Sequelize('iMarmita', 'postgres', 'cafezinho123', {
  host: 'localhost',
  dialect: 'postgres',
  timezone: '-03:00'
})

export default connection
