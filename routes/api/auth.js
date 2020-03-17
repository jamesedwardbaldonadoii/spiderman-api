const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config')
const passport = require('passport')

// Load input validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// Load User model
const mongoose = require('mongoose')
const User = mongoose.model('users')

// Dao
const UserDAO = require('../../dao/UserDAO')

// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body)

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }

  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json({
        email: 'Email already exists'
      })
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        provider: 'local'
      })

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        newUser.salt = salt
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err))
        })
      })
    }
  })
})

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post('/login', async (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body)

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }

  const email = req.body.email
  const password = req.body.password

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({
        message: {
          email: 'Email not found.'
        }
      })
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        }

        const token = jwt.sign(payload, keys.tokenSecret, {
          expiresIn: keys.tokenLife
        })
        const refreshToken = jwt.sign(payload, keys.refreshTokenSecret, {
          expiresIn: keys.refreshTokenLife
        })

        const response = {
          success: true,
          status: 'Logged in',
          accessToken: token,
          refreshToken: refreshToken
        }

        res.status(200).json(response)
      } else {
        return res.status(400).json({
          message: {
            password: 'Emaill and password did not match.'
          }
        })
      }
    })
  })
})

module.exports = router
