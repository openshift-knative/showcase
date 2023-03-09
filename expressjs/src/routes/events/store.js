const { HTTP } = require('cloudevents')

class EventStore {
  constructor() {
    this.events = []
  }

  add(event) {
    this.events.push(event)
  }

  createStream(response) {
    return new Stream(response, this.events)
  }
}

class Stream {
  constructor(response, events) {
    this.idx = 0
    this.active = true
    this.events = events
    this.res = response
  }

  close() {
    this.active = false
    this.res.end()
  }

  stream() {
    this.send()
    if (this.active) {
      setTimeout(() => this.stream(), 100)
    }
  }

  send() {
    while (this.hasNext()) {
      if (!this.active) {
        return
      }
      const curr = this.next()
      const msg = HTTP.structured(curr)
      this.res.write(`data:${msg.body}\n\n`)
    }
  }

  next() {
    if (this.hasNext()) {
      return this.events[this.idx++]
    }
  }

  hasNext() {
    return this.idx < this.events.length
  }
}

module.exports = EventStore
