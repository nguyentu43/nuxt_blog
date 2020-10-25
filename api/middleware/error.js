module.exports = function(err, req, res, next) {
  if (err) {
    let message = err.message
    if (process.env.NODE_ENV === 'production') message = 'error'
    require('../util/json').error(res, message)
  }
}
