const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
const { accessibleRecordsPlugin } = require('@casl/mongoose')
const { MONGODB_URI } = process.env

mongoose.plugin(slug)
mongoose.plugin(accessibleRecordsPlugin)

module.exports = function(req, res, next) {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      autoIndex: false
    })
    .then(function() {
      require('../db/models/user')
      require('../db/models/tag')
      require('../db/models/post')
      require('../db/models/comment')
      require('../db/models/option')

      next()
    })
    .catch(function(err) {
      next(err)
    })
}
