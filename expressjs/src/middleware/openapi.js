const oapi = require('../lib/openapi')
const { resolveProject } = require('../lib/project')
const { isProduction } = require('../lib/env')


module.exports = app => {
  if (isProduction) {
    return
  }
  const project = resolveProject()
  oapi.document.info.title = project.artifact
  oapi.document.info.version = project.version

  app.use(oapi)
  app.use('/swagger-ui', oapi.swaggerui)
}
