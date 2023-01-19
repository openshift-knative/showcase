const promBundle = require('express-prom-bundle')

module.exports = app => {

  app.use(promBundle({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
    includeUp: true,
    promClient: {
      collectDefaultMetrics: {}
    }
  }))

}
