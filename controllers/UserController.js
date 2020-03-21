const router = require('express').Router()

const { BaseController } = require('./BaseController')
const actions = require('../actions/user')

class UserController extends BaseController {
  get router() {
    router.get(
      '/users/current',
      this.actionRunner(actions.GetCurrentUserAction)
    )
    router.post('/users/register', this.actionRunner(actions.CreateUserAction))

    return router
  }

  async init() {
    // this.logger.debug(`${this.constructor.name} initialized...`)
  }
}

module.exports = { UserController }
