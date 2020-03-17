const mongoose = require('mongoose')
const Schema = mongoose.Schema
const BaseSchema = require('./BaseSchema')

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: 'Email is required',
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    validate: [
      function(password) {
        return password && password.length > 6
      },
      'Password should be longer'
    ]
  },
  salt: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerId: String,
  providerData: {},
  verify: {
    email: {
      type: Boolean,
      default: false
    }
  },
  ...BaseSchema
})

module.exports = UserSchema
