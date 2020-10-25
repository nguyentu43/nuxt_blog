const router = require('express').Router()
const Comment = require('../../db/models/comment')
const jsonBuilder = require('../../util/json')

module.exports = router

router.get('/', function(req, res, next) {
  Comment.find({})
    .populate('children')
    .populate('post', { content: 0 })
    .populate('user', { password: 0, photo: 0, resetPassword: 0 })
    .then(function(docs) {
      const result = docs.reduce(function(p, doc) {
        return p.then(function() {
          return Comment.populate(doc.children, {
            path: 'user',
            select: { password: 0, photo: 0, resetPassword: 0 }
          }).then(function(children) {
            doc.children = children
          })
        })
      }, Promise.resolve())

      return result.then(function() {
        return docs
      })
    })
    .then(function(docs) {
      jsonBuilder.success(res, 'comments', docs)
    })
    .catch(function(err) {
      next(err)
    })
})

router.post('/', function(req, res, next) {
  const comment = new Comment({
    ...req.body
  })
  comment.user = req.user._id
  req.user.ability.throwUnlessCan('create', 'Comment')
  comment
    .save()
    .then(function(doc) {
      if (doc) jsonBuilder.success(res, '', null)
    })
    .catch(function(err) {
      next(err)
    })
})

router.param('id', function(req, res, next, id) {
  Comment.accessibleBy(req.user.ability)
    .where({ _id: id })
    .populate('user', { password: 0, photo: 0, resetPassword: 0 })
    .populate('post', { content: '' })
    .populate('children')
    .then(function(docs) {
      if (!docs[0]) {
        jsonBuilder.error(res, 'comment.notFound')
      } else {
        return docs[0]
      }
    })
    .then(function(doc) {
      Comment.populate(doc.children, {
        path: 'user',
        select: { password: 0, photo: 0, resetPassword: 0 }
      }).then(function(children) {
        doc.children = children
        req._comment = doc
        next()
      })
    })
    .catch(function(err) {
      next(err)
    })
})

router
  .route('/:id')
  .get(function(req, res, next) {
    jsonBuilder.success(res, 'comment', req._comment)
  })
  .patch(function(req, res, next) {
    delete req.body.__v

    if (req.user.role !== 'administrator') delete req.body.status

    const comment = req._comment
    req.user.ability.throwUnlessCan('update', comment)
    Object.assign(comment, req.body)

    comment
      .save()
      .then(function(doc) {
        jsonBuilder.success(res, '', null)
      })
      .catch(function(err) {
        next(err)
      })
  })
  .delete(function(req, res, next) {
    req.user.ability.throwUnlessCan('delete', req._comment)
    req._comment
      .remove()
      .then(function() {
        jsonBuilder.success(res, '', null)
      })
      .catch(function(err) {
        next(err)
      })
  })
