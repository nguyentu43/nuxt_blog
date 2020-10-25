const router = require('express').Router()
const multer = require('multer')
const User = require('../../db/models/user')
const jsonBuilder = require('../../util/json')
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 2 }
})

module.exports = router

router.get('/', function(req, res, next) {
  User.accessibleBy(req.user.ability)
    .where({})
    .select({ password: 0, resetPassword: 0, photo: 0 })
    .then(function(docs) {
      jsonBuilder.success(res, 'users', docs)
    })
    .catch(function(err) {
      next(err)
    })
})

router.post('/', upload.single('photo'), function(req, res, next) {
  const user = new User({
    ...req.body
  })

  if (req.file) {
    user.photo = req.file.buffer
  }

  req.user.ability.throwUnlessCan('create', 'User')
  user
    .save()
    .then(function(doc) {
      jsonBuilder.success(res, '', null)
    })
    .catch(function(err) {
      next(err)
    })
})

router.param('id', function(req, res, next, id) {
  User.accessibleBy(req.user.ability)
    .where({ _id: id })
    .findOne()
    .select({ password: 0, resetPassword: 0, photo: 0 })
    .then(function(doc) {
      if (!doc) {
        jsonBuilder.error(res, 'user.notFound')
      } else {
        req._user = doc
        next()
      }
    })
    .catch(function(err) {
      next(err)
    })
})

router
  .route('/:id')
  .get(function(req, res, next) {
    jsonBuilder.success(res, 'user', req._user)
  })
  .patch(upload.single('photo'), function(req, res, next) {
    const user = req._user
    user.firstName = req.body.firstName
    user.lastName = req.body.lastName
    user.role = req.body.role

    if (req.file) {
      user.photo = req.file.buffer
    }

    if (req.body.password && user.providers.includes('email'))
      user.password = req.body.password
    req.user.ability.throwUnlessCan('manage', user)
    user
      .save()
      .then(function(doc) {
        jsonBuilder.success(res, '', null)
      })
      .catch(function(err) {
        next(err)
      })
  })
  .delete(function(req, res, next) {
    req.user.ability.throwUnlessCan('delete', req._user)
    req._user
      .remove()
      .then(function() {
        jsonBuilder.success(res, '', null)
      })
      .catch(function(err) {
        next(err)
      })
  })
