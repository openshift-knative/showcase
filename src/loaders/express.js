module.exports = (app) => {

  // Middleware Functions
  require('../middlewares/misc')(app)
  require('../middlewares/handlebars')(app)
  require('../middlewares/prometeus')(app)

  // Routing
  require('../routes/root')(app)
  require('../routes/hello')(app)
  require('../routes/metrics')(app)
  require('../routes/health')(app)

}
