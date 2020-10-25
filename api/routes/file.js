const router = require('express').Router()
// eslint-disable-next-line import/order
const { createBucket } = require('mongoose-gridfs')
const multer = require('multer')
const jsonBuilder = require('../util/json')
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 10 }
})

module.exports = { path: '/api/files', handler: router }

router.use(function(req, res, next) {
  if (/^\/api\/files\/.+/g.test(req.originalUrl)) {
    next()
  } else if (req.user) {
    if (req.user.role === 'subscriber') {
      next(new Error('Forbiden'))
    } else next()
  } else {
    next(new Error('Log In!'))
  }
})

let File
router.use(function(req, res, next) {
  require('../db/models/file')
    .then(function(file) {
      File = file
      next()
    })
    .catch(function(err) {
      next(err)
    })
})

router.get('/', function(req, res, next) {
  const bucket = createBucket()
  bucket
    .find({})
    .toArray()
    .then(function(files) {
      jsonBuilder.success(res, 'files', files)
    })
    .catch(function(err) {
      next(err)
    })
})

router.param('id', function(req, res, next, id) {
  if (!id) next(new Error('File not found'))
  File.findById(id)
    .then(function(file) {
      if (file) {
        req._file = file
        next()
      } else {
        next(new Error('File not found'))
      }
    })
    .catch(function(err) {
      next(err)
    })
})

router.get('/:id', function(req, res, next) {
  req._file.read().pipe(res)
})

router.delete('/:id', function(req, res, next) {
  req._file.unlink(function(err, unlinked) {
    if (err) return next(err)
    if (unlinked) jsonBuilder.success(res, '', null)
    else jsonBuilder.error(res, { message: 'file.unDelete' })
  })
})

router.post('/', upload.single('file'), function(req, res, next) {
  if (req.file) {
    const upload = req.file
    const file = new File({ filename: upload.originalname })
    const { Readable } = require('stream')
    const stream = new Readable()
    stream.push(upload.buffer)
    stream.push(null)
    file.write(stream, function(err, file) {
      if (err) return next(err)
      else jsonBuilder.success(res, 'file', file)
    })
  } else {
    next(new Error("File can't upload"))
  }
})
