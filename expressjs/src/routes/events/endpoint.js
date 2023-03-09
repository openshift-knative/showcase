const { HTTP } = require('cloudevents')
const openapi = require('../../lib/openapi')
const EventStore = require('./store')
const devdata = require('./devdata')

const store = new EventStore()
devdata.forEach(event => store.add(event))

module.exports = async app => {
  app.get('/events', streamDoc, async (_, res) => {
    res.set('Content-Type', 'text/event-stream')
    res.set('Cache-Control', 'no-cache')
    res.set('Connection', 'keep-alive')
    res.set('X-SSE-Content-Type', 'application/cloudevents+json')
    res.set('transfer-encoding', 'chunked')
    res.flushHeaders()

    const stream = store.createStream(res)
    stream.stream()
  })

  app.post('/events', eventDoc, async (req, res) => {
    try {
      const ce = HTTP.toEvent({ headers: req.headers, body: req.body })
      store.add(ce)
      res.status(201).end()
    } catch (err) {
      console.error(err)
      res.status(500)
      res.json(err)
    }
  })
}

const streamDoc = openapi.path({
  summary: 'Retrieves all registered events as a JSON stream',
  responses: {
    200: {
      headers: {
        'X-SSE-Content-Type': {
          description: 'for example: application/json',
          schema: {
            type: 'string',
          }
        },
        'transfer-encoding': {
          description: 'value: chunked',
          schema: {
            type: 'string',
          }
        },
        'content-type': {
          description: 'value: text/event-stream',
          schema: {
            type: 'string',
          }
        }
      },
      content: {
        'text/event-stream': {
          example: `data:{
  "data": {
    "score": 140
  },
  "datacontenttype": "application/json",
  "id": "2",
  "source": "//localhost/dev",
  "specversion": "1.0",
  "type": "com.redhat.openshift.knative.showcase.Score"
}`
        }
      }
    }
  }
})

const eventDoc = openapi.validPath({
  summary: 'Receives a CloudEvent and stores it',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/CloudEvent'
        }
      },
      'application/cloudevents+json': {
        schema: {
          $ref: '#/components/schemas/CloudEvent'
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Created'
    }
  }
})
