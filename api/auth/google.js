/* eslint-disable camelcase */
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const User = require('../db/models/user')

module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.APP_URL + process.env.GOOGLE_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    const { email, given_name, family_name } = profile._json

    User.findOne({ email }, function(err, user) {
      if (err) done(err)

      if (!user) {
        const user = new User({
          firstName: family_name,
          lastName: given_name,
          email: email,
          providers: ['google']
        })

        user.save(function(err, user) {
          if (err) throw err
          done(null, user)
        })
      } else if (user.providers.includes('google')) done(null, user)
      else {
        user.providers.push('google')
        user.save(function(err, user) {
          if (err) throw err
          done(null, user)
        })
      }
    })
  }
)
