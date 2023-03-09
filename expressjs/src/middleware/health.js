const openapi = require('../lib/openapi')

const Status = {
  UP: 'UP',
  DOWN: 'DOWN',
}

module.exports = app => {

  app.get('/health/ready', doc('ready'), (_, res) => {
    res.json({
      checks: [],
      status: Status.UP
    })
  })

  app.get('/health/live', doc('live'), (_, res) => {
    res.json({
      checks: [],
      status: Status.UP
    })
  })

}

function doc(type) {
  return openapi.path({
    summary: `${type}ness probe`,
    description: `A K8s style ${type} probe`,
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                checks: {
                  type: 'array',
                  list: { type: 'string' }
                }
              },
              example: {
                status: 'OK',
                checks: []
              }
            }
          }
        }
      }
    }
  })
}
