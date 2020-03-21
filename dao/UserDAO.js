// Load User model
const mongoose = require('mongoose')
const User = mongoose.model('users')

const { assert } = require('../lib')

class UserDAO {
  static get model() {
    return 'users'
  }

  static get excluded() {
    return '-password -providerId -providerData'
  }

  static get included() {
    return 'firstname lastname email role verify'
  }

  /**
   * ------------------------------
   * @METHODS4CRUD
   * ------------------------------
   */
  static async create(data) {
    assert.object(data, { required: true, notEmpty: true })

    try {
      const user = await new User(data).save()

      if (!user) {
        // throw this.errorEmptyResponse()
      }

      return user
    } catch (err) {
      // console.log(err, 'TEST')
      //do something here error occur
    }
  }

  static async getByKey(object) {
    try {
      const user = await User.findOne(object).exec()

      if (!user) {
        //do something here error occur
        // throw this.errorEmptyResponse()
      }

      return user
    } catch (err) {
      //do something here error occur
    }
  }

  static async getByID(objectId) {
    try {
      const user = await User.findById(objectId).exec()

      if (!user) {
        //do something here error occur
        // throw this.errorEmptyResponse()
      }

      return user
    } catch (err) {
      //do something here error occur
    }
  }

  static async getByEmail(email) {
    try {
      const user = await User.findOne({ email }).exec()

      if (!user) {
        //do something here error occur
        // throw this.errorEmptyResponse()
      }

      return user
    } catch (err) {
      //do something here error occur
    }
  }

  /**
   * ------------------------------
   * @METHODS
   * ------------------------------
   */
  static async getCurrentUser(userId) {
    const user = await this.getByKey({ _id: userId })

    return {
      id: userId,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      verify: user.verify
    }
  }
}

module.exports = UserDAO
