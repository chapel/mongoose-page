var mongoose = require('mongoose')

mongoose.Query.prototype.page =
mongoose.Query.prototype.paginate =
function paginate(page, limit, callback) {
  if (typeof limit === 'function') {
    callback = limit
  }
  
  if (typeof page === 'object') {
    limit = page.limit
    page = page.page
  }

  page = (parseInt(page, 10) || 1, page < 0 ? 0 : page)
  limit = (parseInt(limit, 10) || 10, limit < 0 ? 10 : limit)

  var skip = (page * limit) - limit
    , model = this.model

  this.skip(skip).limit(limit)

  if (!callback) return this

  this.exec(getDocs)

  function getDocs(err, docs) {
    if (err) return callback(err)

    model.count(query._conditions, getCount)

    function getCount(err, count) {
      if (err) return callback(err)

      callback(null, docs, total)
    }
  }

  return this
}
