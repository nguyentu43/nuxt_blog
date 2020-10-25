const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
const { accessibleRecordsPlugin } = require('@casl/mongoose')
const { MONGODB_URI } = process.env

mongoose.plugin(slug)
mongoose.plugin(accessibleRecordsPlugin)

const connect = mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  autoIndex: false
})

module.exports = connect
