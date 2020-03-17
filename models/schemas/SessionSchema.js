const mongoose = require('mongoose')
const Schema = mongoose.Schema
const BaseSchema = require('./BaseSchema')

const SessionSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  refreshToken: {
    type: String,
    required: true
  },
  fingerprint: {
    type: String,
    required: true
  },
  ua: {
    type: Object,
    required: true
  },
  ip: {
    type: String,
    required: false
  },
  expiredAt: {
    type: Date,
    required: false
  },
  ...BaseSchema
})

module.exports = SessionSchema
