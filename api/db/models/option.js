const mongoose = require('mongoose')

const optionSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'required'],
    unique: true
  },
  value: {
    type: Object,
    required: [true, 'required']
  }
})

optionSchema.post('save', function(err, doc, next) {
  if (err.name === 'MongoError' && err.code === 11000) {
    const validError = new mongoose.Error.ValidationError(this)
    validError.errors.name = new mongoose.Error.ValidatorError({
      message: 'duplicate',
      path: 'name',
      value: this.name
    })
    next(validError)
  } else {
    next(err)
  }
})

module.exports = mongoose.model('Option', optionSchema)
