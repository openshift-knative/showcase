import { Endpoint } from './endpoint'
import { Info } from './types'

class Stub implements Endpoint {
  info(): Promise<Info> {
    const delay = parseInt(process.env.STUB_DELAY ?? '5000')
    const value : Info = {
      config: {
        greet: 'Welcome',
        delay: 0,
        sink: 'http://localhost:31111/',
      },
      project: {
        artifact: 'knative-showcase',
        version: '0.5.1-pre',
        group: 'openshift',
        platform: 'Express/11.1 Node/16',
      }
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(value)
      }, delay)
    })
  }
}

export default Stub
