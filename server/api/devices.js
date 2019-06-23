const router = require('express').Router()
const {Sensor} = require('../db/models')

module.exports = router

router.get('/', (req, res, next) => {
  // console.log(req.user)
  const userID = req.user.id
  let uniqueSerialNumbers = []
  let uniqueDevices = []

  Sensor.findAll({
    where: {
      userId: userID
    }
  })
    .then(devices => {
      // console.log("devices>>", devices)
      devices.forEach(device => {
        // console.log(device.dataValues)
        if (!uniqueSerialNumbers.includes(device.dataValues.serialNumber)) {
          uniqueSerialNumbers.push(device.dataValues.serialNumber)
          uniqueDevices.push(device)
        }
      })
      return res.status(200).json(uniqueDevices)
    })
    .catch(error => next(error))
})

router.get('/:sn', (req, res, next) => {
  // console.log(req.user)
  // console.log("IN ROUTER")
  // console.log(req.params)
  const deviceID = req.params.sn
  const dateNow = new Date()
  console.log(dateNow)
  Sensor.findAll({
    limit: 1,
    where: {
      serialNumber: deviceID
    },
    order: [['createdAt', 'DESC']]
  })
    .then(device => {
      return res.status(200).json(device)
    })
    .catch(error => next(error))
})
