import { shouldStubBackend } from '../config/backend'
import { Config } from '../index/types'
import { CloudEvent } from './u-cloudevents'
import Stub from './stub'
import ServerSentEvents from './sse'

export interface Stream<T> {
  close(): void
  reconnect(): void
  onData(listener: (data: T) => void): void
  onError(listener: (error: Event) => void): void
}

export interface Endpoint {
  stream(): Stream<CloudEvent>
}

export const factory = (config: Config): Endpoint => {
  if (shouldStubBackend) {
    return new Stub(config)
  }
  return new ServerSentEvents()
}
