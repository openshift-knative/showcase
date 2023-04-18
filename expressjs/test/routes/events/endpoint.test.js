const createApp = require('../../../src/app')
const freePort = require('get-port')
const waitForExpect = require('wait-for-expect')
const { CloudEvent, emitterFor, httpTransport } = require('cloudevents')
const EventSource = require('eventsource')
const axios = require('axios').default
const { expect, describe, it } = require('@jest/globals')

describe('Route', () => {
  it('GET,POST /events', async () => {
    const app = await createApp()
    await withServer(app, async port => {
      const messages = []
      const endpoint = `http://localhost:${port}/events`
      const stream = new EventSource(endpoint)
      stream.onmessage = event => {
        messages.push(event.data)
      }
      stream.onerror = error => {
        expect(error).toBeUndefined()
      }

      try {
        const ce = await sendExampleEvent(endpoint)
        await waitForExpect(() => {
          expect(messages).toHaveLength(3)
          expect(JSON.parse(messages[2])).toEqual(ce)
        })
      } finally {
        stream.close()
      }
    })
  })
})

const sendExampleEvent = async endpoint => {
  const ce = new CloudEvent({
    type: 'org.example',
    source: '//tests',
    data: { hello: 'world' },
    datacontenttype: 'application/json',
  })
  const emit = emitterFor(httpTransport(endpoint))
  await emit(ce)

  return ce
}

async function withServer(app, fn) {
  const port = await freePort()
  const listener = app.listen(port)
  await waitForExpect(async () => {
    const res = await axios({
      method: 'get',
      url: `http://localhost:${port}/health/ready`
    })
    expect(res.status).toEqual(200)
  })
  try {
    await fn(port)
  } finally {
    await listener.close()
  }
}
