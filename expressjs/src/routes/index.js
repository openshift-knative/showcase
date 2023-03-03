const { oapi } = require('../middlewares/openapi')
const { resolveProject } = require('../services/project')
const config = require('../services/config')

/**
 * @param {express.Express} app
 */
module.exports = app => {
  app.get('/', getDoc(), async (req, res) => {
    try {
      const project = await resolveProject()
      const idx = new Index({
        artifact: project.artifact,
        greeting: config.greet(),
      })
      addResponseHeaders(res, project)
      if (shouldRenderJson(req)) {
        return res.json(idx)
      }
      const data = { project, config }
      res.render('index', data)
    } catch (err) {
      console.error(err)
      res.status(500)
      res.json(err)
    }
  })

  app.options('/', optionsDoc(), async (_, res) => {
    try {
      const project = await resolveProject()
      const idx = new Index({
        artifact: project.artifact,
        greeting: config.greet(),
      })
      addResponseHeaders(res, project)
      res.json(idx)
    } catch (err) {
      console.error(err)
      res.status(500)
      res.json(err)
    }
  })
}

class Index {
  constructor({ artifact, greeting }) {

    /**
     * @type {string}
     */
    this.artifact = artifact

    /**
     * @type {string}
     */
    this.greeting = greeting
  }
}

/**
 * Adds response headers
 *
 * @param {*} res the response object
 * @param {Project} project holds project info
 */
function addResponseHeaders(res, project) {
  const { sink, greet, delay } = config
  res.header('Server', project.platform)
    .header('X-Version', project.version)
    .header('X-Config', JSON.stringify({
      sink: sink(),
      greet: greet(),
      delay: delay(),
    }))
}

function shouldRenderJson(req) {
  const ua = req.header('user-agent')
  if (ua && ua.startsWith('Mozilla')) {
    return false
  }
  return req.accepts('application/json')
}

function getDoc() {
  return oapi.path({
    summary: 'Main index page',
    description: 'A human readable welcome page with project info',
    responses: {
      200: {
        content: {
          'text/html': {
            example: '<!DOCTYPE html>\n<html lang="en">\n[...]'
          }
        }
      }
    }
  })
}

function optionsDoc() {
  return oapi.path({
    summary: 'Project info',
    description: 'Machine readable (JSON) information about project',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                greeting: { type: 'string' },
                artifact: { type: 'string' }
              },
              example: {
                greeting: 'Welcome',
                artifact: 'knative-showcase'
              }
            }
          }
        }
      }
    }
  })
}
