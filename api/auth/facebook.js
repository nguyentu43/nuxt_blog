/* eslint-disable camelcase */
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../db/models/user')

module.exports = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.APP_URL + process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['email', 'first_name', 'photos', 'last_name']
  },
  function(accessToken, refreshToken, profile, done) {
    const { email, first_name, last_name } = profile._json

    User.findOne({ email }, function(err, user) {
      if (err) done(err)

      if (!user) {
        const user = new User({
          firstName: first_name,
          lastName: last_name,
          email: email,
          providers: ['facebook']
        })

        user.save(function(err, user) {
          if (err) throw err
          done(null, user)
        })
      } else if (user.providers.includes('facebook')) done(null, user)
      else {
        user.providers.push('facebook')
        user.save(function(err, user) {
          if (err) throw err
          done(null, user)
        })
      }
    })
  }
)
