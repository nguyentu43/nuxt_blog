const mongoose = require('mongoose')
const { MONGODB_URI } = process.env
const { createModel } = require('mongoose-gridfs')

module.exports = mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    autoIndex: false
  })
  .then(function() {
    return createModel({ connection: mongoose.connection })
  })
