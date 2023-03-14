import { CloudEvent } from './u-cloudevents'
import { Endpoint, Stream } from './endpoint'
import { baseAddress } from '../config/backend'

export default class ServerSentEvents implements Endpoint {
  stream(): Stream<CloudEvent> {
    return new SseStream()
  }
}

class SseStream implements Stream<CloudEvent> {
  private listeners: ((ce: CloudEvent) => void)[] = []
  private errs: ((error: Event) => void)[] = []
  private sse?: EventSource

  constructor() {
    this.init()
  }
  
  close(): void {
    this.sse?.close()
  }
  reconnect(): void {
    this.close()
    this.init()
  }
  onData(listener: (data: CloudEvent<any>) => void): void {
    this.listeners.push(listener)
  }
  onError(listener: (error: Event) => void): void {
    this.errs.push(listener)
  }

  private init() {
    const sse = new EventSource(`${baseAddress}/events`, { withCredentials: true })
    sse.onmessage = (e: MessageEvent) => {
      const ce = new CloudEvent(JSON.parse(e.data))
      this.listeners.forEach((l) => l(ce))
    }
    sse.onerror = (e: Event) => {
      this.errs.forEach((l) => l(e))
    }
    this.sse = sse
  }
}
