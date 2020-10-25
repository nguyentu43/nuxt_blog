const mongoose = require('mongoose')
const tagSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    slug: 'name'
  }
})

tagSchema.post('save', function(err, doc, next) {
  if (err.name === 'MongoError' && err.code === 11000) {
    const validError = new mongoose.Error.ValidationError(this)
    validError.errors.name = new mongoose.Error.ValidatorError({
      message: 'tag name duplicate',
      path: 'name',
      value: this.name
    })
    next(validError)
  } else {
    next(err)
  }
})

module.exports = mongoose.model('Tag', tagSchema)
