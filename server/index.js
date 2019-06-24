const path = require('path')
const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const session = require('express-session')
const passport = require('passport')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const db = require('./db')
const sessionStore = new SequelizeStore({db})
const PORT = process.env.PORT || 8080
const app = express()
const socketio = require('socket.io')
const {Sensor, User} = require('./db/models/')

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

var nodemailer = require('nodemailer')
process.env.HUMIDITY_LOW_SET_POINT = 10
process.env.HUMIDITY_HIGH_SET_POINT = 20

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'user@gmail.com',
    pass: 'password'
  }
})

var mailOptions = {
  from: '"Home Alert System" <snambiar01@gmail.com>',
  to: 'snambiar01@mail.com',
  subject: 'Alarm Triggered',
  html:
    '<p>Your sensor has triggered an alarm. Please take action, to avoid receving these emails.</p>'
}

const port = new SerialPort('/dev/ttyACM0', {baudRate: 9600}, function(err) {
  if (err) {
    return console.log('Error: ', err.message)
  }
})

const parser = port.pipe(new Readline({delimiter: '\n'}))
module.exports = app

// This is a global Mocha hook, used for resource cleanup.
// Otherwise, Mocha v4+ never quits after tests.
if (process.env.NODE_ENV === 'test') {
  after('close the session store', () => sessionStore.stopExpiringSessions())
}

/**
 * In your development environment, you can keep all of your
 * app's secret API keys in a file called `secrets.js`, in your project
 * root. This file is included in the .gitignore - it will NOT be tracked
 * or show up on Github. On your production server, you can add these
 * keys as environment variables, so that they can still be read by the
 * Node process on process.env
 */
if (process.env.NODE_ENV !== 'production') require('../secrets')

// passport registration
passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

const createApp = () => {
  // logging middleware
  app.use(morgan('dev'))

  // body parsing middleware
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))

  // compression middleware
  app.use(compression())

  // session middleware with passport
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'my best friend is Cody',
      store: sessionStore,
      resave: false,
      saveUninitialized: false
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  // auth and api routes
  app.use('/auth', require('./auth'))
  app.use('/api', require('./api'))

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, '..', 'public')))

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found')
      err.status = 404
      next(err)
    } else {
      next()
    }
  })

  // sends index.html
  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'))
  })

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
}

const startListening = () => {
  // start listening (and create a 'server' object representing our server)

  const server = app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  )

  // set up our socket control center
  const io = socketio(server)
  require('./socket')(io)

  port.on('open', () => {
    console.log('serial port open')
  })

  parser.on('data', data => {
    let splitData = data.split(',')
    splitData.pop()

    let serialNum = Number(splitData[0])
    let temp = Number(splitData[1])
    temp = Math.round(temp * (9 / 5) + 32)
    let hum = Number(splitData[2])
    let id = 1
    let name = 'Sid Nambiar'
    let status = ''

    if (hum > Number(process.env.HUMIDITY_HIGH_SET_POINT)) {
      status = 'Humdity is high!'

      transporter.sendMail(mailOptions, function(err, info) {
        if (err) console.log(err)
        else console.log(info)
      })
    } else if (hum < Number(process.env.HUMIDITY_LOW_SET_POINT)) {
      status = 'Humdity is low!'
    } else {
      status = 'GOOD'
    }

    let dataToSendToClient = [temp, hum, serialNum, status]
    if (serialNum && temp && hum) {
      io.emit('temp-hum', dataToSendToClient)
      storeSensoreData(serialNum, temp, hum, id, name)
    }
  })
}

const syncDb = () => db.sync()

async function storeSensoreData(serialNumber, temperature, humidity, userId) {
  try {
    const sensorData = {
      serialNumber,
      temperature,
      humidity,
      userId
    }

    await Sensor.create(sensorData)
  } catch (err) {
    console.error(err)
  }
}

async function bootApp() {
  await sessionStore.sync()
  await syncDb()
  await createApp()
  await startListening()
}
// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  bootApp()
} else {
  createApp()
}
