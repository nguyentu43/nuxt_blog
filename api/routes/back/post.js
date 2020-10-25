const router = require('express').Router()
const mongoose = require('mongoose')
const Post = require('../../db/models/post')
const Tag = require('../../db/models/tag')
const jsonBuilder = require('../../util/json')

module.exports = router

router.get('/', function(req, res, next) {
  Post.accessibleBy(req.user.ability)
    .where({})
    .populate('user', { password: 0, photo: 0, resetPassword: 0 })
    .populate('tags')
    .then(function(docs) {
      jsonBuilder.success(res, 'posts', docs)
    })
    .catch(function(err) {
      next(err)
    })
})

router.post('/', async function(req, res, next) {
  try {
    const tags = []
    for (const tag of req.body.tags) {
      if (typeof tag === 'string') {
        const newTag = new Tag({ name: tag })
        await newTag.save()
        tags.push(newTag)
      } else {
        tags.push(mongoose.Types.ObjectId(tag._id))
      }
    }
    req.body.tags = tags
    const post = new Post({
      ...req.body
    })
    if (req.user === 'contributor') {
      req.status = 'pending'
    }
    req.user.ability.throwUnlessCan('create', 'Post')
    post.user = req.user._id
    await post.save()
    jsonBuilder.success(res, 'post', post)
  } catch (err) {
    next(err)
  }
})

router.param('id', function(req, res, next, id) {
  Post.accessibleBy(req.user.ability)
    .where({ _id: id })
    .findOne()
    .populate('tags')
    .then(function(doc) {
      if (!doc) {
        jsonBuilder.error(res, 'post.notFound')
      } else {
        req._post = doc
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
    jsonBuilder.success(res, 'post', req._post)
  })
  .patch(async function(req, res, next) {
    try {
      delete req.body.user
      const post = req._post
      const tags = []
      for (const tag of req.body.tags) {
        if (typeof tag === 'string') {
          const newTag = new Tag({ name: tag })
          await newTag.save()
          tags.push(newTag)
        } else {
          tags.push(mongoose.Types.ObjectId(tag._id))
        }
      }

      if (req.user === 'contributor') {
        req.status = 'pending'
      }
      req.body.tags = tags
      Object.assign(post, req.body)
      req.user.ability.throwUnlessCan('update', req._post)
      await post.save()
      jsonBuilder.success(res, '', null)
    } catch (err) {
      next(err)
    }
  })
  .delete(function(req, res, next) {
    req.user.ability.throwUnlessCan('delete', req._post)
    req._post
      .remove()
      .then(function() {
        jsonBuilder.success(res, '', null)
      })
      .catch(function(err) {
        next(err)
      })
  })
