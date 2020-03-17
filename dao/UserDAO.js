// Load User model
const mongoose = require('mongoose')
const User = mongoose.model('users')

const { assert } = require('../lib')

class UserDAO {
  static get model() {
    return 'users'
  }

  /**
   * ------------------------------
   * @HOOKS
   * ------------------------------
   */
  $formatJson(json) {
    json = super.$formatJson(json)

    // delete sensitive data from all queries
    delete json.salt
    delete json.password
    delete json.email

    return json
  }

  /**
   * ------------------------------
   * @METHODS4CRUD
   * ------------------------------
   */
  static async getByID(objectId) {
    try {
      const data = await User.findById(objectId).exec()

      if (!data) {
        //do something here error occur
        // throw this.errorEmptyResponse()
      }

      return data
    } catch (err) {
      //do something here error occur
    }
  }

  static async getByEmail(email) {
    try {
      const data = await User.findOne({ email }).exec()

      if (!data) {
        //do something here error occur
        // throw this.errorEmptyResponse()
      }

      return data
    } catch (err) {
      //do something here error occur
    }
  }
}

module.exports = UserDAO
