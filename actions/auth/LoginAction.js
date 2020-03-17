const BaseAction = require('../BaseAction')
const { checkPassword } = require('../common/checkPassword')
const { makeAccessToken } = require('./common/makeAccessToken')
const { errorCodes, AppError } = require('../../lib')
const UserDAO = require('../../dao/UserDao')
const SessionDAO = require('../../dao/SessionDAO')

const validateLoginInput = require('../validation/login')

class LoginAction extends BaseAction {
  static get accessTag() {
    return 'auth:login'
  }

  // static get validationRules () {
  //   return {
  //     body: {
  //       password: new RequestRule(AuthModel.schema.password, { required: true }),
  //       email: new RequestRule(AuthModel.schema.email, { required: true }),
  //       fingerprint: new RequestRule(AuthModel.schema.fingerprint, { required: true })
  //     }
  //   }
  // }

  static async run(ctx) {
    const { errors, isValid } = validateLoginInput(ctx.body)

    // Check validation
    if (!isValid) {
      throw new AppError({ ...errorCodes.INVALID_CREDENTIALS })
    }

    let user = {}

    try {
      user = await UserDAO.getByEmail(ctx.body.email)
      await checkPassword(ctx.body.password, user.password)
    } catch (e) {
      if (
        [errorCodes.NOT_FOUND.code, errorCodes.INVALID_PASSWORD.code].includes(
          e.code
        )
      ) {
        throw new AppError({ ...errorCodes.INVALID_CREDENTIALS })
      }
      throw e
    }

    const newSession = SessionDAO.entity({
      user: user.id,
      ip: ctx.ip,
      ua: ctx.headers['User-Agent'],
      fingerprint: ctx.body.fingerprint
    })

    await SessionDAO.addSession(newSession)

    return this.result({
      data: {
        accessToken: await makeAccessToken(user),
        refreshToken: newSession.refreshToken
      }
    })
  }
}

module.exports = LoginAction
