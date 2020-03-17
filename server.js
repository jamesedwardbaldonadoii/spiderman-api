const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express()

const logger = null //temporary I have not setup loggers yet

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

app.use(bodyParser.json())

// Passport middleware
app.use(passport.initialize())

const logRequestStart = (req, res, next) => {
  console.info(`${req.method} ${req.originalUrl}`)
  next()
}

app.use(logRequestStart)

// Mongoose
require('./models/index')()

// Passport config
require('./config/passport')(passport)

/**
 * @middlewares initialization
 */
const middlewares = require('./middlewares')
try {
  for (const middleware of middlewares.map(
    Middleware => new Middleware({ logger })
  )) {
    middleware.init()
    app.use(middleware.handler())
  }
} catch (e) {
  console.log('Middleware Error', e)
  // return reject(e)
}

/**
 * @controllers initialization
 */
const controllers = require('./controllers')
try {
  for (const controller of controllers.map(
    Controller => new Controller({ logger })
  )) {
    controller.init()
    app.use(controller.router)
  }
} catch (e) {
  console.log('Controller Error', e)
  // reject(e)
}

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server up and running on port ${port} !`))
