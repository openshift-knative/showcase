import Local from './Local'
import Rest from './Rest'
import { Info } from './types'

export interface Endpoint {
  info(): Promise<Info>
}

const EndpointFactory = (): Endpoint => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    // dev code
    return new Local()
  }
  // production code
  return new Rest()
}

export {
  EndpointFactory
}
