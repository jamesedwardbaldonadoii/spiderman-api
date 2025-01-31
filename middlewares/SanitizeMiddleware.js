const { BaseMiddleware } = require('./BaseMiddleware')
// const logger = require('../logger')

class SanitizeMiddleware extends BaseMiddleware {
  async init() {
    // logger.debug(`${this.constructor.name} initialized...`)
  }

  handler() {
    return (req, res, next) => {
      next()
    }
  }
}

module.exports = { SanitizeMiddleware }
