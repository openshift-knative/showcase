const morgan = require('morgan')

module.exports = app => {

  app.use(morgan('dev', {
    skip(_req, _res) {
      return typeof jest !== 'undefined'
    }
  }))

}
