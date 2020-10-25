/* eslint-disable import/order */
const express = require('express')
const router = express.Router()
const Post = require('../../db/models/post')
const Tag = require('../../db/models/tag')
const Option = require('../../db/models/option')
const Comment = require('../../db/models/comment')
const User = require('../../db/models/user')
const jsonBuilder = require('../../util/json')
const path = require('path')
const multer = require('multer')
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 2 }
})

module.exports = { path: '/api/front', handler: router }

router.get('/options', function(req, res, next) {
  Option.find().then(function(docs) {
    const options = {}
    for (const doc of docs) {
      options[doc.name] = doc.value
    }
    jsonBuilder.success(res, 'options', options)
  })
})

router.get('/posts', async function(req, res, next) {
  let { page, itemsPerPage, sortBy, keyword, tag, user } = req.query
  const { exactTag, exactUser } = req.query

  page = page || 1
  itemsPerPage = itemsPerPage ? Number(itemsPerPage) : 10
  sortBy = sortBy || 'createdAt'
  let asc = 1
  if (sortBy[0] === '-') {
    sortBy = sortBy.substr(1)
    asc = -1
  }

  if (tag) tag = `.*${tag}.*`
  else tag = '.*'

  if (user) user = `.*${user}.*`
  else user = '.*'

  if (keyword) keyword = `.*${keyword}.*`
  else keyword = '.*'

  const query = {
    title: { $regex: keyword },
    content: { $regex: keyword }
  }

  if (exactTag) query.tags = exactTag
  if (exactUser) query.user = exactUser

  try {
    const docs = await Post.where({
      ...query
    })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .sort({ [sortBy]: asc })
      .byAvailable()
      .populate({ path: 'tags', match: { name: { $regex: tag } } })
      .populate({
        path: 'user',
        match: {
          $or: [{ firstName: { $regex: user } }, { lastName: { $regex: user } }]
        },
        select: { password: 0, photo: 0, resetPassword: 0 }
      })
    jsonBuilder.success(res, 'posts', docs, {
      total: await Post.where({
        ...query
      })
        .populate({ path: 'tags', match: { name: { $regex: tag } } })
        .populate({
          path: 'user',
          match: {
            $or: [
              { firstName: { $regex: user } },
              { lastName: { $regex: user } }
            ]
          },
          select: { password: 0, photo: 0, resetPassword: 0 }
        })
        .count()
    })
  } catch (err) {
    next(err)
  }
})

router.param('slug', function(req, res, next, slug) {
  let post = Post.findOne({ slug })

  if (req.method === 'POST') post = post.byAvailable({})
  else post = post.byAvailable()
  post
    .populate('user', { password: 0, photo: 0, resetPassword: 0 })
    .populate('tags')
    .then(function(doc) {
      if (doc) {
        req._post = doc
        next()
      } else jsonBuilder.error(res, 'post.notFound')
    })
    .catch(function(err) {
      next(err)
    })
})

router.get('/posts/:slug', async function(req, res, next) {
  const post = req._post

  if (post.status === 'private') {
    post.content = null
  }
  try {
    const nextPost = await Post.find({}, { content: 0 })
      .byAvailable()
      .where({ _id: { $gt: post._id }, user: post.user._id })
      .sort({ _id: 1 })
      .limit(1)
    const prevPost = await Post.find({}, { content: 0 })
      .byAvailable()
      .where({ _id: { $lt: post._id }, user: post.user._id })
      .sort({ _id: -1 })
      .limit(1)
    jsonBuilder.success(res, 'post', post, {
      next: nextPost[0],
      prev: prevPost[0]
    })
  } catch (err) {
    next(err)
  }
})

router.post('/posts/:slug', function(req, res, next) {
  const post = req._post
  const password = req.body.password
  if (password) {
    if (!post.validPassword(password)) {
      jsonBuilder.fail(res, { password: 'notMatch' })
    } else {
      jsonBuilder.success(res, 'post', post)
    }
  } else {
    jsonBuilder.fail(res, { password: 'required' })
  }
})

router.use('/posts/:slug/comments', function(req, res, next) {
  if (req.method === 'GET') {
    next()
  } else if (req.user) {
    next()
  } else {
    next(new Error('Log In!'))
  }
})

router
  .route('/posts/:slug/comments')
  .get(function(req, res, next) {
    let query = Comment.find({
      status: 'publish',
      parent: { $exists: false },
      post: req._post._id
    }).populate('children', { match: { status: 'publish' } })

    if (req.user && req.user.role === 'administrator')
      query = Comment.find({
        parent: { $exists: false },
        post: req._post._id
      }).populate('children')

    query
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
  .post(function(req, res, next) {
    const comment = new Comment({
      ...req.body
    })
    comment.user = req.user._id
    comment.post = req._post._id

    req.user.ability.throwUnlessCan('create', 'Comment')
    comment
      .save()
      .then(function(doc) {
        jsonBuilder.success(res, '', null)
      })
      .catch(function(err) {
        next(err)
      })
  })

router.param('commentId', function(req, res, next, commentId) {
  Comment.findOne({ _id: commentId })
    .then(function(doc) {
      if (doc) {
        req._comment = doc
        next()
      } else {
        jsonBuilder.error(res, 'comment.notFound')
      }
    })
    .catch(function(err) {
      next(err)
    })
})

router
  .route('/posts/:slug/comments/:commentId')
  .patch(function(req, res, next) {
    delete req.body.__v
    if (req.user.role !== 'administrator') delete req.body.status
    const comment = req._comment
    Object.assign(comment, req.body)
    req.user.ability.throwUnlessCan('update', comment)
    comment
      .save()
      .then(function() {
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

router.get('/tags', async function(req, res, next) {
  try {
    const docs = await Tag.find({}).lean()
    for (const doc of docs) {
      doc.postCount = await Post.where({ tags: doc._id })
        .byAvailable()
        .count()
    }
    jsonBuilder.success(res, 'tags', docs)
  } catch (err) {
    next(err)
  }
})

router.get('/tags/:slugTag', function(req, res, next) {
  Tag.findOne({ slug: req.params.slugTag })
    .then(function(doc) {
      if (doc) jsonBuilder.success(res, 'tag', doc)
      else next(new Error('Tag not found'))
    })
    .catch(function(err) {
      next(err)
    })
})

router.get('/users/:id', function(req, res, next) {
  User.findOne(
    { _id: req.params.id },
    { password: 0, resetPassword: 0, photo: 0 }
  )
    .then(function(doc) {
      if (doc) jsonBuilder.success(res, 'user', doc)
      else next(new Error('User not found'))
    })
    .catch(function(err) {
      next(err)
    })
})

router.get('/photo/:id', function(req, res, next) {
  const id = req.params.id
  User.findOne({ _id: id })
    .then(function(user) {
      if (user && user.photo) {
        res.end(user.photo)
      } else {
        res.sendFile(
          path.join(__dirname, '..', '..', '..', 'assets/person.png')
        )
      }
    })
    .catch(function() {
      res.sendFile(path.join(__dirname, '..', '..', '..', 'assets/person.png'))
    })
})

router.patch('/user', upload.single('photo'), function(req, res, next) {
  if (!req.user) {
    return next(new Error('Log In'))
  } else {
    User.findOne({ _id: req.user._id }, function(err, user) {
      if (err) return next(err)
      const oldPassword = req.body.oldPassword
      let p = Promise.resolve()
      if (oldPassword) {
        p = user.validPassword(oldPassword).then(function(v) {
          if (v) {
            user.password = req.body.password
          } else {
            return next(new Error('Sai password'))
          }
        })
      }
      p.then(function() {
        if (req.file) {
          user.photo = req.file.buffer
        }

        delete req.body.password
        delete req.body.oldPassword
        delete req.body.role
        delete req.body.providers
        Object.assign(user, req.body)
        req.user.ability.throwUnlessCan('update', user)
        return user.save()
      })
        .then(function() {
          jsonBuilder.success(res, '', null)
        })
        .catch(function(err) {
          return next(err)
        })
    })
  }
})
