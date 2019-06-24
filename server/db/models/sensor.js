const Sequelize = require('sequelize')
const db = require('../db')

const Sensor = db.define('sensor', {
  serialNumber: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

  temperature: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

  humidity: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

  imageUrl: {
    type: Sequelize.STRING,
    defaultValue: 'https://png.pngtree.com/svg/20170424/948583fb9c.svg'
  }
})

module.exports = Sensor
