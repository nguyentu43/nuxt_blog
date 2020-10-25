const router = require('express').Router()
const Tag = require('../../db/models/tag')
const Post = require('../../db/models/post')
const jsonBuilder = require('../../util/json')

module.exports = router

router.get('/', async function(req, res, next) {
  try {
    const docs = await Tag.find({}).lean()
    for (const doc of docs) {
      doc.postCount = await Post.find({ tags: doc._id }).count()
    }
    jsonBuilder.success(res, 'tags', docs)
  } catch (err) {
    next(err)
  }
})

router.post('/', function(req, res, next) {
  const tag = new Tag({
    ...req.body
  })

  req.user.ability.throwUnlessCan('create', 'Tag')
  tag
    .save()
    .then(function(doc) {
      if (doc) jsonBuilder.success(res, '', null)
    })
    .catch(function(err) {
      next(err)
    })
})

router.param('id', function(req, res, next, id) {
  Tag.findOne({ _id: id })
    .then(function(doc) {
      if (!doc) {
        jsonBuilder.error(res, 'tag.notFound')
      } else {
        req._tag = doc
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
    jsonBuilder.success(res, 'tag', req._tag)
  })
  .patch(function(req, res, next) {
    req.user.ability.throwUnlessCan('update', req._tag)
    Object.assign(req._tag, req.body)
    req._tag
      .save()
      .then(function(doc) {
        jsonBuilder.success(res, '', null)
      })
      .catch(function(err) {
        next(err)
      })
  })
  .delete(function(req, res, next) {
    req.user.ability.throwUnlessCan('delete', req._tag)
    req._tag
      .remove()
      .then(function() {
        jsonBuilder.success(res, '', null)
      })
      .catch(function(err) {
        next(err)
      })
  })
