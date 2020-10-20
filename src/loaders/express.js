module.exports = (app) => {

  // Middleware Functions
  require('../middlewares/misc')(app)
  require('../middlewares/handlebars')(app)
  require('../middlewares/prometeus')(app)

  // Routing
  require('../routes/index')(app)
  require('../routes/hello')(app)
  require('../routes/health')(app)

}
