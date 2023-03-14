import { baseAddress } from '../config/backend'
import { Endpoint } from './endpoint'
import { Info } from './types'

class Rest implements Endpoint {
  info(): Promise<Info> {
    return new Promise(async (resolve, reject) => {
      const infoAddr = `${baseAddress}/info`
      const res = await fetch(infoAddr)
      if (res.ok) {
        const value = await res.json()
        resolve(value)
      } else {
        reject(res)
      }
    })
  }
}

export default Rest
