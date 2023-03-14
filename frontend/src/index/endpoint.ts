import { shouldStubBackend } from '../config/backend'
import Stub from './stub'
import Rest from './rest'
import { Info } from './types'

export interface Endpoint {
  info(): Promise<Info>
}

export const factory = (): Endpoint => {
  if (shouldStubBackend) {
    return new Stub()
  }
  return new Rest()
}
