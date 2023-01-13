const { engine } = require('express-handlebars')

module.exports = app => {
  app.engine('handlebars', engine())
  app.set('view engine', 'handlebars')
}
