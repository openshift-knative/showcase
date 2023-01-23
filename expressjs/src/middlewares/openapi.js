const openapi = require('@unleash/express-openapi')
const { resolveProject } = require('../services/project')

const oapi = openapi({
  openapi: '3.0.0',
  info: {
    description: 'Knative Showcase for JS',
  }
})

module.exports = {
  middleware: async app => {
    const project = await resolveProject()
    oapi.document.info.title = project.artifact
    oapi.document.info.version = project.version
    app.use(oapi)
    if (process.env.NODE_ENV !== 'production') {
      app.use('/swagger-ui', oapi.swaggerui)
    }
  },
  oapi
}
