const crypto = require('crypto')
const mongoose = require('mongoose')
const dayjs = require('dayjs')
const Comment = require('./comment')

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'required']
  },
  slug: {
    type: String,
    slug: 'title',
    unique: true
  },
  status: {
    type: String,
    enum: ['publish', 'private', 'pending', 'future', 'draft'],
    default: 'publish'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'required']
  },
  schedule: {
    type: {
      open: Date,
      close: Date
    },
    validate: {
      validator: function() {
        if (this.status !== 'future') return true
        return dayjs(this.schedule.open).isBefore(dayjs(this.schedule.close))
      },
      message: 'open <= close'
    },
    required: [
      function() {
        return this.status === 'future'
      },
      'required'
    ]
  },
  password: {
    type: String,
    validate: {
      validator: function() {
        if (this.isModified('password') && this.password) {
          return this.password.length >= 6 && this.password.length <= 25
        }
        return true
      },
      message: 'length >= 6 <=25'
    }
  },
  excerpt: String,
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  photo: String,
  createdAt: {
    type: Date,
    default: dayjs().format('YYYY-MM-DDTHH:mm:ss')
  },
  updatedAt: Date,
  keyword: String
})

postSchema.methods.validPassword = function(password) {
  return (
    this.password ===
    crypto
      .createHash('md5')
      .update(password)
      .digest('hex')
  )
}

postSchema.pre('save', function() {
  if (this.isModified('password') && this.password) {
    this.password = crypto
      .createHash('md5')
      .update(this.password)
      .digest('hex')
  }
  this.updatedAt = dayjs().format('YYYY-MM-DDTHH:mm:ss')
})

postSchema.pre('remove', function(next) {
  Comment.deleteMany({ post: this._id }, function(err) {
    if (err) next(err)
    next()
  })
})

postSchema.query.byAvailable = function(select = { password: 0 }) {
  return this.select(select).where({
    $or: [
      { status: 'publish' },
      {
        status: 'future',
        'schedule.open': { $lte: dayjs().format('YYYY-MM-DDTHH:mm:ss') },
        'schedule.close': { $gte: dayjs().format('YYYY-MM-DDTHH:mm:ss') }
      },
      { status: 'private' }
    ]
  })
}

module.exports = mongoose.model('Post', postSchema)
