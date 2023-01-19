module.exports = async app => {

  // Middleware Functions
  require('../middlewares/logging')(app)
  require('../middlewares/public')(app)
  require('../middlewares/handlebars')(app)
  require('../middlewares/prometeus')(app)
  await require('../middlewares/openapi').middleware(app)

  // Routing
  require('../routes/index')(app)
  require('../routes/hello')(app)
  require('../routes/health')(app)

}
