const express = require('express')
const exphbs = require('express-handlebars')
const morgan = require('morgan')

module.exports = (app) => {
  // Middleware Functions
  app.use(morgan('dev'))
  app.use(express.static('public'))

  app.engine('handlebars', exphbs())
  app.set('view engine', 'handlebars')

  // Routing
  require('../routes/root')(app)
  require('../routes/hello')(app)
  require('../routes/metrics')(app)
}
