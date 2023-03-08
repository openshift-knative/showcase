import { Endpoint } from './Endpoint'
import { Info } from './types'

class Local implements Endpoint {
  info(): Promise<Info> {
    const delay = parseInt(process.env.LOCAL_DELAY ?? '500')
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

export default Local
