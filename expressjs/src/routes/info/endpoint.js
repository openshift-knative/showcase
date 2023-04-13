const config = require('../../lib/config')
const openapi = require('../../lib/openapi')
const { resolveProject } = require('../../lib/project')
const Info = require('./info')

/**
 * @param {express.Express} app
 */
module.exports = app => {
  app.get('/info', doc, async (_, res) => {
    try {
      const project = await resolveProject()
      const info = new Info({
        project, config: {
          sink: config.sink(),
          greet: config.greet(),
          delay: config.delay()
        }
      })
      res.status(200)
      res.json(info)
    } catch (err) {
      console.error(err)
      res.status(500)
      res.json(err)
    }
  })
}

const doc = openapi.path({
  summary: 'Retrives info about project',
  description: 'Information about project like coordinates and versions',
  responses: {
    200: {
      content: {
        'application/json': {
          example: {
            config: {
              delay: 0,
              greet: 'Welcome',
              sink: 'http://localhost:31111'
            },
            project: {
              artifact: 'knative-showcase',
              group: 'openshift',
              platform: 'Express/4.18.2 Node/18.14.2',
              version: 'v0.5.0-50-g730a719-dirty'
            }
          }
        }
      }
    }
  }
})
