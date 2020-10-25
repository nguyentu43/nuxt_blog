module.exports = {
  success: function(res, prop, data, meta = null) {
    if (data == null) {
      res.json({
        status: 'success',
        data: null
      })
    } else {
      let result = {
        [prop]: data
      }

      if (meta) result = { ...result, ...meta }
      res.json({
        status: 'success',
        data: result
      })
    }
  },
  fail: function(res, data) {
    res.json({
      status: 'fail',
      data
    })
  },
  error: function(res, message, code = null, data = null) {
    res.status(404)
    res.json({
      status: 'error',
      message,
      code,
      data
    })
  }
}
