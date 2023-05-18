const Printer = require('../../../src/routes/events/printer')
const { CloudEvent } = require('cloudevents')
const { expect, describe, it } = require('@jest/globals')

describe('Printer', () => {
  const printer = new Printer()

  describe('JSON', () => {
    const ce = new CloudEvent({
      type: 'org.example',
      source: '//tests',
      data: { hello: 'world' },
      id: '123',
      time: new Date('2020-08-01T12:00:00Z').toISOString(),
      datacontenttype: 'application/json',
    })

    it('should print a CE', () => {
      const out = printer.print(ce)
      expect(out).toEqual(`☁️  cloudevents.Event
Validation: valid
Context Attributes,
  specversion: 1.0
  type: org.example
  source: //tests
  id: 123
  time: 2020-08-01T12:00:00.000Z
  datacontenttype: application/json
Data,
  {
    "hello": "world"
  }
`)
    })
  })

  describe('XML', () => {
    const ce = new CloudEvent({
      type: 'org.example',
      source: '//tests',
      data: `<hello>world</hello>`,
      id: '456',
      time: new Date('2020-08-01T12:00:00Z').toISOString(),
      datacontenttype: 'text/xml',
    })

    it('should print a CE', () => {
      const out = printer.print(ce)
      expect(out).toEqual(`☁️  cloudevents.Event
Validation: valid
Context Attributes,
  specversion: 1.0
  type: org.example
  source: //tests
  id: 456
  time: 2020-08-01T12:00:00.000Z
  datacontenttype: text/xml
Data,
  <hello>world</hello>
`)
    })
  })

  describe('Binary', () => {
    const ce = new CloudEvent({
      type: 'org.example',
      source: '//tests',
      data: new TextEncoder().encode('hello world'),
      id: '789',
      time: new Date('2020-08-01T12:00:00Z').toISOString(),
      datacontenttype: 'application/octet-stream',
    }, false)

    it('should print a CE', () => {
      const out = printer.print(ce)
      expect(out).toEqual(`☁️  cloudevents.Event
Validation: valid
Context Attributes,
  specversion: 1.0
  type: org.example
  source: //tests
  id: 789
  time: 2020-08-01T12:00:00.000Z
  datacontenttype: application/octet-stream
Data,
  104,101,108,108,111,32,119,111,114,108,100
`)
    })
  })

  describe('With extensions and subject', () => {
    const ce = new CloudEvent({
      type: 'org.example',
      source: '//tests',
      id: '9012',
      time: new Date('2020-08-01T12:00:00Z').toISOString(),
      subject: 'subject',
      datacontentencoding: 'base64',
      dataschema: 'http://example.com/schema',
      datacontenttype: 'plain/text',
      traceId: '1234',
    }, false)

    it('should print a CE', () => {
      const out = printer.print(ce)
      expect(out).toEqual(`☁️  cloudevents.Event
Validation: invalid
Context Attributes,
  specversion: 1.0
  type: org.example
  source: //tests
  id: 9012
  subject: subject
  time: 2020-08-01T12:00:00.000Z
  datacontentencoding: base64
  dataschema: http://example.com/schema
  datacontenttype: plain/text
Extensions,
  traceId: 1234
`)
    })
  })
})
