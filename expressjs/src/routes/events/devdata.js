const { CloudEvent } = require('cloudevents')
const { isProduction } = require('../../lib/env')
const { log } = require('../../lib/logging')

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

function newEvent() {
  return new CloudEvent({
    type: 'com.redhat.openshift.knative.showcase.Hello',
    source: '//localhost/dev',
    datacontenttype: 'application/json',
    time: new Date(random(1640991600000, 1678446163750)).toISOString(),
    data: {
      greeting: 'Welcome',
      who: `Developer${random(0, 100)}`,
      number: random(0, 100),
    }
  })
}

const devdata = [newEvent(), newEvent()].filter(() => !isProduction)

log.debug('Deploying dev data: %j', !isProduction)

module.exports = devdata
