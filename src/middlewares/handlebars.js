const exphbs = require('express-handlebars')

module.exports = (app) => {
  app.engine('handlebars', exphbs())
  app.set('view engine', 'handlebars')
}
