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
  }
})

module.exports = Sensor
