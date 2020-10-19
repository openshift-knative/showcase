const axios = require('axios').default
const { HTTP, CloudEvent } = require('cloudevents')
const { getSink } = require('./config')

let number = 0

module.exports = {
  hello: async ({ who }) => {
    const type = 'io.github.cardil.knsvng.domain.entity.Hello'
    const source = '//events/serving-showcase'
    const data = {
      greeting: 'Hello',
      number: ++number,
      who,
    }
    const url = await getSink()

    const ce = new CloudEvent({ type, source, data })
    const message = HTTP.binary(ce)

    try {
      await axios({
        method: 'post',
        url,
        data: message.body,
        headers: message.headers,
      })
      console.log(`Event ${ce.id} sent to ${url}`)
      return {
        success: true,
        data
      }
    } catch (err) {
      console.error(err)
      return {
        success: false,
        data: err
      }
    }
  }
}
