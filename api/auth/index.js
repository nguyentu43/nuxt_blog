/* eslint-disable import/order */
const router = require('express').Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const dayjs = require('dayjs')
const randomString = require('randomstring')
const pug = require('pug')
const User = require('../db/models/user')
const casl = require('../casl')
const jsonBuilder = require('../util/json')
const sendMail = require('../mail')
const GoogleStrategy = require('./google')
const FacebookStrategy = require('./facebook')
const path = require('path')

module.exports = { path: '/api/auth', handler: router }

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  User.findOne(
    { _id: id },
    { password: false, photo: false, resetPassword: false }
  )
    .then(function(user) {
      user.ability = casl(user)
      done(null, user)
    })
    .catch(function(err) {
      done(err)
    })
})

passport.use(
  new LocalStrategy({ usernameField: 'email' }, function(
    username,
    password,
    done
  ) {
    User.findOne({ email: username, providers: { $in: ['email'] } }, function(
      err,
      user
    ) {
      if (err) return done(err)

      if (!user) {
        return done(null, false)
      } else {
        user
          .validPassword(password)
          .then(function(v) {
            if (!v) return done(null, false)
            else return done(null, user)
          })
          .catch(function(err) {
            return done(err)
          })
      }
    })
  })
)

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err)
    if (!user) {
      return jsonBuilder.fail(res, 'login fail')
    }
    req.login(user, function(err) {
      if (err) {
        return next(err)
      }
      return jsonBuilder.success(res, '', null)
    })
  })(req, res, next)
})

router.post('/register', function(req, res, next) {
  const { firstName, lastName, email, password } = req.body

  User.findOne({ email, providers: { $ne: 'email' } })
    .then(function(user) {
      if (user) {
        user.password = password
        user.firstName = firstName
        user.lastName = lastName
        user.providers.push('email')
        user.save(function(err, user) {
          if (err) {
            next(err)
          } else jsonBuilder.success(res, '', null)
        })
      } else {
        const user = new User({
          firstName,
          lastName,
          email,
          providers: ['email'],
          password
        })

        user.save(function(err, user) {
          if (err) {
            next(err)
          } else jsonBuilder.success(res, '', null)
        })
      }
    })
    .catch(function(err) {
      next(err)
    })
})

passport.use(FacebookStrategy)
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }))
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/auth',
    successRedirect: '/'
  })
)

passport.use(GoogleStrategy)
router.get(
  '/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  })
)
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth',
    successRedirect: '/'
  })
)

router.get('/user', function(req, res, next) {
  if (req.user) jsonBuilder.success(res, 'user', req.user)
  else next(new Error('auth.login'))
})

router.get('/logout', function(req, res, next) {
  if (req.user) {
    req.logOut()
    jsonBuilder.success(res, '', null)
  } else next(new Error('auth.logout'))
})

router.post('/reset', function(req, res, next) {
  if (req.body.email) {
    User.findOne({ email: req.body.email, providers: 'email' }).then(function(
      user
    ) {
      if (user) {
        user.resetPassword = {
          key: randomString.generate(25),
          expire: dayjs()
            .add(1, 'day')
            .format('YYYY-MM-DDTHH:mm:ss')
        }
        user.save(function(err, user) {
          if (err) {
            next(err)
          } else {
            const host = process.env.APP_URL
            const href = host + '/auth/reset/' + user.resetPassword.key
            const html = pug.renderFile(
              path.join(__dirname, '..', 'mail/templates/reset.pug'),
              {
                firstName: user.firstName,
                lastName: user.lastName,
                href
              }
            )
            sendMail(null, user.email, 'Reset password', '', html).then(
              function() {
                jsonBuilder.success(res, '', null)
              }
            )
          }
        })
      } else jsonBuilder.success(res, '', null)
    })
  } else {
    jsonBuilder.fail(res, { email: 'required' })
  }
})

router.post('/reset/:key', function(req, res, next) {
  const key = req.params.key

  if (req.body.password) {
    User.findOne({
      'resetPassword.key': key,
      'resetPassword.expire': { $gte: dayjs().format('YYYY-MM-DDTHH:mm:ss') }
    })
      .then(function(user) {
        if (user) {
          user.password = req.body.password
          user.resetPassword = null
          user.save(function(err, user) {
            if (err) return next(err)
            jsonBuilder.success(res, '', null)
          })
        } else {
          jsonBuilder.fail(res, { reset: 'expired' })
        }
      })
      .catch(function(err) {
        next(err)
      })
  } else {
    jsonBuilder.fail(res, { password: 'required' })
  }
})
