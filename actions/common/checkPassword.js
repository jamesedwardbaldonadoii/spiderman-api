const bcrypt = require('bcryptjs')
const { errorCodes, AppError, assert } = require('../../lib')

/**
 * @description make from req.body.password hash and compare it with existing password hash
 * @return {Promise} true/Error
 * @password req.body.password
 * @hash [user].password
 */

function checkPassword(password, hash) {
  assert.string(password, { notEmpty: true })
  assert.string(hash, { notEmpty: true })

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (error, result) => {
      if (error) return reject(new AppError(error))
      if (!result)
        return reject(new AppError({ ...errorCodes.INVALID_PASSWORD }))
      return resolve(result)
    })
  })
}

module.exports = { checkPassword }
