const router = require('express').Router()

module.exports = { path: '/api/back', handler: router }

router.use(function(req, res, next) {
  if (req.user) {
    if (req.user.role === 'subscriber') {
      next(new Error('Forbiden'))
    } else next()
  } else {
    next(new Error('Log In!'))
  }
})

router.use('/options', require('./option'))
router.use('/tags', require('./tag'))
router.use('/users', require('./user'))
router.use('/posts', require('./post'))
router.use('/comments', require('./comment'))
router.use('/dashboard', require('./dashboard'))
