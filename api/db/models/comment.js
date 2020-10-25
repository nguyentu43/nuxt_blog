const mongoose = require('mongoose')
const dayjs = require('dayjs')

const commentSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'required']
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'required']
  },
  createdAt: {
    type: Date,
    default: dayjs().format('YYYY-MM-DDTHH:mm:ss')
  },
  status: {
    type: String,
    enum: ['publish', 'lock'],
    default: 'publish'
  },
  updatedAt: Date
})

commentSchema.pre('save', function(next) {
  const self = this
  const model = this.model('Comment')
  self.updatedAt = dayjs().format('YYYY-MM-DDTHH:mm:ss')
  if (self.isModified('parent') && self.parent) {
    model
      .findOne({ _id: self.parent })
      .then(function(doc) {
        if (!doc) {
          const validError = new mongoose.Error.ValidationError(self)
          validError.errors.name = new mongoose.Error.ValidatorError({
            message: 'required',
            path: 'parent',
            value: self.name
          })
          next(validError)
        } else {
          next()
        }
      })
      .catch(function(err) {
        next(err)
      })
  } else {
    next()
  }
})

commentSchema.post('save', function(doc, next) {
  const model = this.model('Comment')
  if (doc.parent) {
    model
      .findOneAndUpdate(
        { _id: doc.parent },
        { $addToSet: { children: doc._id } }
      )
      .then(function() {
        next()
      })
      .catch(function(err) {
        next(err)
      })
  } else {
    next()
  }
})

commentSchema.pre('remove', function(next) {
  const model = this.model('Comment')
  if (!this.parent) {
    model
      .deleteMany({ parent: this._id })
      .then(function() {
        next()
      })
      .catch(function(err) {
        next(err)
      })
  } else {
    model
      .findOneAndUpdate({ _id: this.parent }, { $pull: { children: this._id } })
      .then(function() {
        next()
      })
      .catch(function(err) {
        next(err)
      })
  }
})

module.exports = mongoose.model('Comment', commentSchema)
