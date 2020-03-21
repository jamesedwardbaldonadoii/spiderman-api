const mongoose = require('mongoose')
const Schema = mongoose.Schema
const BaseSchema = require('./BaseSchema')

// Create Schema
const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
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
  role: {
    type: String,
    default: 'user',
    enum: ['admin', 'superadmin', 'moderator', 'user']
  },
  provider: {
    type: String,
    default: 'local',
    enum: ['local', 'facebook', 'google']
  },
  providerId: { 
    type: String
  },
  providerData: {},
  verify: {
    email: {
      type: Boolean,
      default: false
    },
    mobile: {
      type: Boolean,
      default: false
    }
  },
  ...BaseSchema
})

module.exports = UserSchema
