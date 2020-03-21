const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const SessionDAO = require('../../dao/SessionDAO')

const { verifySession } = require('./common/verifySession')
const { makeAccessToken } = require('./common/makeAccessToken')

class RefreshTokensAction extends BaseAction {
  static get accessTag() {
    return 'auth:refresh-tokens'
  }

  // static get validationRules () {
  //   return {
  //     body: {
  //       refreshToken: new RequestRule(AuthModel.schema.refreshToken, { required: true }),
  //       fingerprint: new RequestRule(AuthModel.schema.fingerprint, { required: true }) // https://github.com/Valve/fingerprintjs2
  //     }
  //   }
  // }

  static async run(ctx) {
    const reqRefreshToken = ctx.body.refreshToken
    const reqFingerprint = ctx.body.fingerprint

    const oldSession = await SessionDAO.getByRefreshToken(reqRefreshToken)

    await SessionDAO.bulkRemoveByKey({ refreshToken: reqRefreshToken })
    await verifySession(SessionDAO.entity(oldSession), reqFingerprint)
    const user = await UserDAO.getByID(oldSession.user)

    const newSession = SessionDAO.entity({
      user: user._id,
      ip: ctx.ip,
      ua: ctx.headers['User-Agent'],
      fingerprint: reqFingerprint
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

module.exports = RefreshTokensAction
