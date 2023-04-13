const openapi = require('../../lib/openapi')
const { Greeter } = require('./greeter')

module.exports = app => {

  app.get('/hello', doc(), async (req, res) => {
    // Success
    const greeter = new Greeter(require('../../lib/config'))
    const who = req.query.who || 'Person'
    const hello = await greeter.hello(who)

    res.json(hello)
  }, (err, _, res, next) => {
    // Validation error
    res.status(err.status).json({
      error: err.message,
      validation: err.validationErrors,
      schema: err.validationSchema
    })

    next()
  })

}

function doc() {
  return openapi.validPath({
    summary: 'Say hello with a Greeter',
    description: 'Greeting can be changed by setting environment variable GREET',
    parameters: [
      {
        name: 'who',
        in: 'query',
        description: 'Who to greet?',
        required: false,
        example: 'Chris',
        schema: { type: 'string', pattern: '^[A-Z][a-z]+$' },
      }
    ],
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                greeting: { type: 'string' },
                who: { type: 'string' },
                number: { type: 'integer' }
              },
              example: {
                greeting: 'Hello',
                who: 'Chris',
                number: 1
              }
            }
          }
        }
      },
      400: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'Request validation failed' },
                schema: { type: 'object' },
                validation: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      dataPath: { type: 'string' },
                      keyword: { type: 'string' },
                      message: { type: 'string' },
                    },
                    example: {
                      dataPath: '.query.who',
                      keyword: 'pattern',
                      message: 'should match pattern "^[A-Z][a-z]+$"'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
}
