module.exports = function(req, res, next) {
  if (req.body) {
    delete req.body._id
    delete req.body.createdAt
    delete req.body.updatedAt
  }
  next()
}
