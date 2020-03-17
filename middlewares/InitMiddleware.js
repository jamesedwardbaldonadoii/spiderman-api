const { BaseMiddleware } = require('./BaseMiddleware')
const config = require('../config')
// const logger = require('../logger')

class InitMiddleware extends BaseMiddleware {
  async init() {
    // logger.debug(`${this.constructor.name} initialized...`)
  }

  handler() {
    return (req, res, next) => {
      res.header('Server', config.appName)
      next()
    }
  }
}

module.exports = { InitMiddleware }
