const { errorCodes } = require('../lib')
const { BaseMiddleware } = require('./BaseMiddleware')

const { jwtVerify } = require('../actions/common/jwt')
const SECRET = require('../config').tokenSecret
const roles = require('../permissions/roles')
// const logger = require('../logger')

class CheckAccessTokenMiddleware extends BaseMiddleware {
  async init() {
    // logger.debug(`${this.constructor.name} initialized...`)
  }

  handler() {
    return (req, res, next) => {
      const authorization =
        req.headers['authorization'] || req.headers['Authorization']
      const bearer =
        authorization && authorization.startsWith('Bearer ')
          ? authorization
          : null
      const token = bearer ? bearer.split('Bearer ')[1] : null

      // set default meta data
      req.currentUser = Object.freeze({
        id: null,
        firstname: null,
        lastname: null,
        role: roles.anonymous,
        email: null,
        expiresIn: null
      })

      if (token) {
        return jwtVerify(token, SECRET)
          .then(tokenData => {
            // set actual current user
            req.currentUser = Object.freeze({
              id: tokenData.sub,
              firstname: tokenData.firstname,
              lastname: tokenData.lastname,
              role: tokenData.role,
              email: tokenData.email,
              expiresIn: Number(tokenData.exp)
            })

            next()
          })
          .catch(error => {
            if (error.code === errorCodes.TOKEN_EXPIRED.code) {
              /**
               * pass request if token is not valid
               * in this case security service will consider that request as anonymous request
               */
              next()
            } else {
              next(error)
            }
          })
      }
      next()
    }
  }
}

module.exports = { CheckAccessTokenMiddleware }
