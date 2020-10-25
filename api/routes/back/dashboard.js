const router = require('express').Router()
const User = require('../../db/models/user')
const Post = require('../../db/models/post')
const Tag = require('../../db/models/tag')
const jsonBuilder = require('../../util/json')

module.exports = router

router.get('/', async function(req, res, next) {
  const dashboard = {}
  try {
    dashboard.users = {
      count: await User.estimatedDocumentCount()
    }
    dashboard.tags = {
      count: await Tag.estimatedDocumentCount()
    }
    dashboard.posts = {
      count: await Post.estimatedDocumentCount(),
      newest: await Post.accessibleBy(req.user.ability)
        .where({ status: 'publish' }, {}, { sort: { createAt: -1 } })
        .populate('user', { password: 0, photo: 0, resetPassword: 0 })
        .limit(10)
    }

    if (req.user.ability.can('manage', 'all')) {
      dashboard.users.newest = await User.find(
        {},
        { resetPassword: 0, photo: 0, password: 0 },
        { sort: { createdAt: -1 } }
      ).limit(10)
    }

    jsonBuilder.success(res, 'dashboard', dashboard)
  } catch (err) {
    next(err)
  }
})
