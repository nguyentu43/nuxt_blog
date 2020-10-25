const path = require('path')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const passport = require('passport')
const mongoose = require('mongoose')
const session = require('express-session')
const logger = require('morgan')
const MongoStore = require('connect-mongo')(session)
const csurf = require('csurf')
const cookieParser = require('cookie-parser')

app.use(require('./middleware/db'))

app.use(logger('combined'))
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
)

app.use(passport.initialize())
app.use(passport.session())
app.use(csurf({ cookie: true }))

app.use(require('./middleware/filterBodyParser'))
app.use(function(req, res, next) {
  if (req.method === 'POST' && req.url === '/api/auth/login') {
    if (req.body.rememberme) {
      req.session.cookie.maxAge = 2592000000
    } else {
      req.session.cookie.expires = false
    }
  }
  next()
})

module.exports = { path: '/api', handle: app }
