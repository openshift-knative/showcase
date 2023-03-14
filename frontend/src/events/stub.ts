import { CloudEvent } from './u-cloudevents'
import { Config } from '../index/types'
import { Endpoint, Stream } from './endpoint'

export default class Stub implements Endpoint {
  private config: Config
  constructor(config: Config) {
    this.config = config
  }
  stream(): Stream<CloudEvent> {
    return new StubStream(this.config)
  }
}

class StubStream implements Stream<CloudEvent> {
  private counter : number
  private active = true
  private listeners: ((ce: CloudEvent<any>) => void)[] = []
  private errs: ((error: Event) => void)[] = []
  private config: Config

  constructor(config: Config) {
    this.config = config
    this.counter = 0
    setInterval(() => {
      this.tick()
    }, 25)
  }

  close(): void {
    this.active = false
  }
  reconnect(): void {
    console.log('reconnecting...')
    this.active = true
  }
  onData(listener: (data: CloudEvent<any>) => void): void {
    this.listeners.push(listener)
  }
  onError(listener: (error: Event) => void): void {
    this.errs.push(listener)
  }

  private tick() {
    this.counter++
    if (!this.active) {
      return
    }
    const chances = {
      event: this.counter % 100 === 0,
      error: this.counter % 1000 === 0,
    }
    if (chances.error) {
      return this.error()
    }
    if (chances.event) {
      return this.emit()
    }
  }

  private emit() {
    const ce = new CloudEvent({
      source: '//devdata/js',
      type: 'com.redhat.openshift.example.Hello',
      datacontenttype: 'application/json',
      data: {
        greeting: this.config.greet,
        number: this.counter,
        who: 'Person',
      },
    })
    this.listeners.forEach((lst) => lst(ce))
  }

  private error() {
    const e = new Event('error')
    this.errs.forEach((lst) => lst(e))
  }
}
