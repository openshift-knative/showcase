const { oapi } = require('../middlewares/openapi')
const { resolveProject } = require('../services/project')

module.exports = app => {
  const project = resolveProject()
  app.get('/', getDoc(), async (req, res) => {
    try {
      if (shouldRenderJson(req)) {
        return res.json(await project)
      }
      res.render('index', { project: await project })
    } catch (err) {
      console.error(err)
      res.status(500)
      res.json(err)
    }
  })

  app.options('/', optionsDoc(), async (_, res) => {
    try {
      res.json(await project)
    } catch (err) {
      console.error(err)
      res.status(500)
      res.json(err)
    }
  })
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
                version: { type: 'string' },
                artifact: { type: 'string' },
                platform: {
                  type: 'object',
                  properties: {
                    node: { type: 'string' },
                    npm: { type: 'string' }
                  }
                }
              },
              example: {
                version: 'v1.3.1',
                artifact: '@openshift/knative-showcase',
                platform: {
                  node: 'v12.19.0',
                  npm: 'v6.14.8'
                }
              }
            }
          }
        }
      }
    }
  })
}
