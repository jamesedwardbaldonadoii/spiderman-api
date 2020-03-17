// Load Session model
const mongoose = require('mongoose')
const Session = mongoose.model('sessions')
const { v4: uuidv4 } = require('uuid')
const moment = require('moment')

const { assert } = require('../lib')
const { refreshTokenLife } = require('../config')

const MAX_SESSIONS_COUNT = 5

class SessionDAO {
  static get model() {
    return 'sessions'
  }

  /**
   * ------------------------------
   * @Schema
   * ------------------------------
   */
  static entity(src) {
    const data = {}

    data.refreshToken = uuidv4()
    data.user = src.user
    data.fingerprint = src.fingerprint
    data.ip = src.ip
    data.ua = src.ua || null
    data.expiredAt = moment()
      .add(refreshTokenLife, 'seconds')
      .format()

    return data
  }

  /**
   * ------------------------------
   * @METHODS4CRUD
   * ------------------------------
   */

  static async create(data) {
    assert.object(data, { required: true, notEmpty: true })

    try {
      const session = await new Session(data).save()
      if (!session) {
        // throw this.errorEmptyResponse()
      }

      return session
    } catch (err) {
      // console.log(err, 'TEST')
      //do something here error occur
    }
  }

  static async bulkRemoveByKey(data) {
    assert.object(data, { required: true, notEmpty: true })

    try {
      const session = await Session.deleteMany(data).exec()

      if (!session) {
        // throw this.errorEmptyResponse()
      }

      return session
    } catch (err) {
      // console.log(err, 'TEST')
      //do something here error occur
    }
  }

  static async countByKey(data) {
    assert.object(data, { required: true, notEmpty: true })

    try {
      const count = await Session.countDocuments(data).exec()
      if (!count) {
        // throw this.errorEmptyResponse()
      }

      return count
    } catch (err) {
      // console.log(err, 'TEST')
      //do something here error occur
    }
  }

  static async findOneByKey(data) {
    assert.object(data, { required: true, notEmpty: true })

    try {
      const count = await Session.findOne(data).exec()
      if (!count) {
        // throw this.errorEmptyResponse()
      }

      return count
    } catch (err) {
      // console.log(err, 'TEST')
      //do something here error occur
    }
  }

  /**
   * ------------------------------
   * @METHODS
   * ------------------------------
   */
  static async addSession(session) {
    if (await this._isValidSessionsCount(session.user)) {
      await this.create(session)
    } else {
      await this.bulkRemoveByKey({ user: session.user })
      await this.create(session)
    }
  }

  static async _isValidSessionsCount(user) {
    const existingSessionsCount = await this.countByKey({ user })

    return existingSessionsCount < MAX_SESSIONS_COUNT
  }

  static async baseRemoveWhere(user) {
    const existingSessionsCount = await this.countByKey({ user })

    return existingSessionsCount < MAX_SESSIONS_COUNT
  }

  static async getByRefreshToken(refreshToken) {
    assert.string(refreshToken, { notEmpty: true })

    const result = this.findOneByKey({ refreshToken })

    if (!result) {
      //do something on error
      // throw this.errorEmptyResponse()
    }

    return result
  }
}

module.exports = SessionDAO
