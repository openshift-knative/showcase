const { oapi } = require('../middlewares/openapi')

const Status = {
  UP: 'UP',
  DOWN: 'DOWN',
}

module.exports = (app) => {

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
  return oapi.path({
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
