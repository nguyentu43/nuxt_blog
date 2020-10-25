const jsonBuilder = require('../util/json')

module.exports = function(err, req, res, next) {
  switch (err.name) {
    case 'ValidationError':
      const errors = {}

      for (const path in err.errors) {
        const error = err.errors[path]
        errors[path] = error.message
      }

      jsonBuilder.fail(res, errors)
      break
    default:
      next(err)
  }
}
