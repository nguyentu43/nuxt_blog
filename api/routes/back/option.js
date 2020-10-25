const router = require('express').Router()
const Option = require('../../db/models/option')
const jsonBuilder = require('../../util/json')

module.exports = router

router.get('/', function(req, res, next) {
  Option.find().then(function(docs) {
    const options = {}
    for (const doc of docs) {
      options[doc.name] = doc.value
    }
    jsonBuilder.success(res, 'options', options)
  })
})

router.patch('/', function(req, res, next) {
  const options = req.body.options

  const re = Object.entries(options).reduce(function(p, [name, value]) {
    return p.then(function() {
      return Option.findOneAndUpdate({ name }, { value })
    })
  }, Promise.resolve())

  re.then(function() {
    jsonBuilder.success(res, '', null)
  }).catch(function(err) {
    next(err)
  })
})
