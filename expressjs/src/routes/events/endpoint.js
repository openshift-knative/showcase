const { HTTP } = require('cloudevents')
const openapi = require('../../lib/openapi')
const EventStore = require('./store')
const { PrinterFactory } = require('./pretty-print')
const devdata = require('./devdata')

const printerFactory = new PrinterFactory()

/**
 * @typedef {import('./pretty-print').Printer} Printer
 * @typedef {import('express').Express} Express
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

/**
 * @type {Printer}
 */
let printer

/**
 * @type {EventStore}
 */
let store

/**
 * Initializes the routes.
 *
 * @param {Express} app - the Express app
 */
async function events(app) {
  printer = await printerFactory.create()

  app.get('/events', streamDoc, stream)
  app.post('/', eventDoc, recv)
  app.post('/events', eventDoc, recv)

  store = new EventStore()
  devdata.forEach(event => recvEvent(event))
}

/**
 * Streams all registered CloudEvents.
 *
 * @param {Request} _
 * @param {Response} res - the HTTP response
 */
function stream(_, res) {
  res.set('Content-Type', 'text/event-stream')
  res.set('Cache-Control', 'no-cache')
  res.set('Connection', 'keep-alive')
  res.set('X-SSE-Content-Type', 'application/cloudevents+json')
  res.set('transfer-encoding', 'chunked')
  res.flushHeaders()

  const str = store.createStream(res)
  str.stream()
}

/**
 * Receives a CloudEvent from an HTTP request.
 * @param {Request} req - the HTTP request
 * @param {Response} res - the HTTP response
 * @returns {void}
 */
function recv(req, res) {
  try {
    const ce = HTTP.toEvent({ headers: req.headers, body: req.body })
    recvEvent(ce)
    res.status(201).end()
  } catch (err) {
    console.error(err)
    res.status(500)
    res.json(err)
  }
}

/**
 * Receives a CloudEvent, logs, and stores it.
 *
 * @param {CloudEvent} ce - the CloudEvent to receive
 */
function recvEvent(ce) {
  ce.validate()
  store.add(ce)
  const out = printer.print(ce)
  console.log('Received:\n', out)
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

const eventDoc = openapi.path({
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

module.exports = events
