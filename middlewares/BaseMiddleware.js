const { assert } = require('../lib')

class BaseMiddleware {
  constructor() {
    // { logger } = {}
    // this.logger = logger
  }

  async init() {
    throw new Error(`${this.constructor.name} should implement 'init' method.`)
  }

  handler() {
    throw new Error(
      `${this.constructor.name} should implement 'handler' method.`
    )
  }
}

module.exports = { BaseMiddleware }
