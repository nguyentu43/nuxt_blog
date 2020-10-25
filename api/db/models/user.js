const dayjs = require('dayjs')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { ValidationError, ValidatorError } = mongoose.Error
const validate = require('mongoose-validator')
const validator = require('validator')

const userSchema = mongoose.Schema({
  firstName: {
    required: [true, 'required'],
    type: String,
    trim: true
  },
  lastName: {
    required: [true, 'required'],
    type: String,
    trim: true
  },
  email: {
    type: String,
    index: true,
    required: [true, 'required'],
    unique: true,
    validate: validate({
      validator: 'isEmail',
      passIfEmpty: false,
      message: 'notValid'
    }),
    set: function(v) {
      return validator.normalizeEmail(v)
    }
  },
  providers: {
    type: Array,
    required: true,
    default: ['email']
  },
  password: {
    type: String,
    validate: {
      validator: function() {
        if (!this.isModified('password')) {
          return true
        } else {
          return this.password.length >= 6 && this.password.length <= 25
        }
      },
      message: 'length >=6 <=25'
    },
    required: [
      function() {
        return this.providers.includes('email')
      },
      'required'
    ]
  },
  role: {
    type: String,
    enum: ['administrator', 'editor', 'author', 'contributor', 'subscriber'],
    default: 'subscriber'
  },
  resetPassword: {
    key: String,
    expire: Date
  },
  photo: mongoose.Schema.Types.Buffer,
  createdAt: {
    type: Date,
    default: dayjs().format('YYYY-MM-DDTHH:mm:ss')
  },
  updatedAt: Date
})

userSchema.methods.validPassword = function(password) {
  return bcrypt.compare(password, this.password)
}

userSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName
})

const SALT_WORK_FACTOR = 10
userSchema.pre('save', function(next) {
  const user = this
  user.updatedAt = dayjs().format('YYYY-MM-DDTHH:mm:ss')
  if (!user.isModified('password')) {
    return next()
  } else {
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err)

      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err)
        user.password = hash
        next()
      })
    })
  }
})

userSchema.post('save', function(err, doc, next) {
  if (err.name === 'MongoError' && err.code === 11000) {
    const validError = new ValidationError(this)
    validError.errors.email = new ValidatorError({
      message: 'Email duplicate',
      path: 'email',
      value: this.email
    })
    next(validError)
  } else {
    next(err)
  }
})

module.exports = mongoose.model('User', userSchema)
