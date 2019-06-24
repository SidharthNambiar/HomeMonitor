const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.status(200).json(users)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const userID = req.user.id
    const humidityHighPoint = Number(req.body.humidityHighPoint) || 10
    const humidityLowPoint = Number(req.body.humidityLowPoint) || 20

    await User.update(
      {
        humidityHighPoint,
        humidityLowPoint
      },
      {
        where: {
          id: userID
        }
      }
    )

    const updateInfo = await User.findByPk(userID)

    process.env.HUMIDITY_LOW_SET_POINT = updateInfo.humidityLowPoint
    process.env.HUMIDITY_HIGH_SET_POINT = updateInfo.humidityHighPoint

    res.status(201).send('complete')
  } catch (err) {
    next(err)
  }
})
