const mongoose = require('mongoose')
const config = require('../config')

module.exports = () => {
  mongoose.Promise = global.Promise

  // Connect to MongoDB
  const db = mongoose
    .set('useCreateIndex', true)
    .connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log(err))

  // Models
  mongoose.model('users', require('./schemas/UserSchema'))
  mongoose.model('sessions', require('./schemas/SessionSchema'))

  return db
}
