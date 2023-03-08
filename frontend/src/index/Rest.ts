import { Endpoint } from './Endpoint'
import { Info } from './types'

class Rest implements Endpoint {
  info(): Promise<Info> {
    throw new Error("Method not implemented.")
  }
}

export default Rest
