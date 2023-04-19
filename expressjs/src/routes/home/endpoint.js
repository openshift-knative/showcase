const config = require('../../lib/config')
const oapi = require('../../lib/openapi')
const { resolveProject } = require('../../lib/project')
const { log } = require('../../lib/logging')

/**
 * @param {express.Express} app
 */
const home = app => {
  app.get('/', doc, async (req, res) => {
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
      res.status(200)
        .sendFile('home.html', { root: 'public' })
    } catch (err) {
      log.error(err)
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

const doc = oapi.path({
  summary: 'Displays a home page, or the short project info',
  description: 'Displays a index HTML page, or the project info in '
    + 'JSON format if the Accept header is set to application/json or called '
    + 'not from a browser',
  responses: {
    200: {
      content: {
        'text/html': {
          example: '<!DOCTYPE html>\n<html lang="en">\n[...]'
        },
        'application/json': {
          example: {
            artifact: 'knative-showcase',
            greeting: 'Welcome',
          }
        }
      }
    }
  }
})

module.exports = home
