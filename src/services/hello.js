const request = require('superagent')
const { HTTP, CloudEvent } = require('cloudevents')

const type = 'io.github.cardil.knsvng.domain.entity.Hello'
const source = '//events/serving-showcase'

let number = 0

class Greeter {
  constructor(getSink) {
    this.getSink = getSink
  }

  async hello({ who }) {
    const data = {
      greeting: 'Hello',
      number: ++number,
      who,
    }
    const url = await this.getSink()
    const ce = new CloudEvent({ type, source, data })
    const message = HTTP.structured(ce)

    try {
      const req = request.post(url)
      Object.keys(message.headers).forEach((key) => {
        req.set(key, message.headers[key])
      })
      await req.send(message.body)
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

module.exports = {
  Greeter
}
