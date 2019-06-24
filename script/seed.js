'use strict'

const db = require('../server/db')
const {User, Sensor} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({
      email: 'cody@email.com',
      password: '123',
      name: 'Robin Hood',
      humidityLowPoint: 10,
      humidityHighPoint: 20
    }),
    User.create({
      email: 'murphy@email.com',
      password: '123',
      name: 'Macintosh Watkins',
      humidityLowPoint: 10,
      humidityHighPoint: 20
    })
  ])

  const sensors = await Promise.all([
    Sensor.create({
      serialNumber: 100,
      temperature: 75,
      humidity: 20,
      userId: 1,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg039XAhUWQRGpM-YNYZhLwL2kTDiMaKRbKr4iMwtUMyTt--ud'
    }),
    Sensor.create({serialNumber: 101, temperature: 45, humidity: 8, userId: 2}),
    Sensor.create({
      serialNumber: 102,
      temperature: 89,
      humidity: 66,
      userId: 2
    }),
    Sensor.create({
      serialNumber: 103,
      temperature: 90,
      humidity: 32,
      userId: 2
    }),
    Sensor.create({
      serialNumber: 104,
      temperature: 75,
      humidity: 12,
      userId: 2
    })
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded ${sensors.length} sensors`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
