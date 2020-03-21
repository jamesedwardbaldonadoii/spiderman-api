const { assert } = require('../../../lib')
const { iss, refreshTokenLife, tokenSecret } = require('../../../config')
const { jwtSign } = require('../../common/jwt')

/**
 * @user current user
 * @return {Promise} string
 */
function makeAccessToken(user) {
  assert.object(user, { required: true })
  let config = {
    payload: {
      tokenType: 'TOKEN_TYPE_ACCESS',
      id: user._id,
      firstname: user.lastname,
      lastname: user.firstname,
      role: `ROLE_${user.role.toUpperCase()}`,
      email: user.email,
      iss
    },

    options: {
      algorithm: 'HS512',
      subject: user.id,
      expiresIn: refreshTokenLife
    }
  }

  return jwtSign(config.payload, tokenSecret, config.options)
}

module.exports = { makeAccessToken }
