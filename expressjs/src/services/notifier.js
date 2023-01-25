const axios = require('axios').default
const { HTTP, CloudEvent } = require('cloudevents')

const type = 'com.redhat.openshift.knative.showcase.domain.entity.Hello'
const source = '//events/showcase'


class Notifier {
  constructor({ sink }) {

    /**
     * @type {() => string}
     */
    this.sink = sink
  }

  /**
   * @param {Hello} hello
   */
  async notifyFor(hello) {
    const url = this.sink()
    const ce = new CloudEvent({
      type, source, data: hello
    })
    const message = HTTP.binary(ce)

    try {
      await axios({
        method: 'post',
        url,
        data: message.body,
        headers: message.headers
      })
      console.log(`Event ${ce.id} sent to ${url}`)
    } catch (err) {
      console.error(`Couldn't send an event ${ce.id} to ${url}`, err)
    }
  }
}

module.exports = {
  Notifier
}
