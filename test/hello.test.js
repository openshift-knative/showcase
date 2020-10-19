const nock = require('nock')
const getPort = require('get-port')
const { HTTP, CONSTANTS } = require('cloudevents')

const { Greeter } = require('../src/services/hello')
const getMockUrl = (port) => `http://localhost:${port}/`

let counter = 0
const people = ['Alice', 'Bob', 'Charlie', 'Dug', 'Emilii', 'Greg']

it('Greeter / hello', async () => {
  const port = await getPort()
  const url = getMockUrl(port)
  const who = people[Math.ceil(Math.random() * people.length)]
  let receivedEvent = {}

  nock(url)
    .post('/')
    .reply(200, (uri, body) => {
      counter++

      const headers = {
        'content-type': CONSTANTS.DEFAULT_CE_CONTENT_TYPE,
      }

      receivedEvent = HTTP.toEvent({ headers, body: body.toString() })

      return { success: true, who }
    })

  const g = new Greeter(() => url)
  const response = await g.hello({ who })
  expect(response.success).toEqual(true)
  expect(response.data.who).toEqual(who)
  expect(receivedEvent.data.who).toEqual(who)
  expect(counter).toEqual(1)
})
