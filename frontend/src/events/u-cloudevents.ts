// Workaround for cloudevents/sdk-javascript#534
// TODO: remove this when the issue is fixed

import { uuid } from './uuid'

export class CloudEvent<T = any> implements CloudEventV1<T> {
  id: string
  source: string
  type: string
  subject?: string
  specversion: string
  time: string
  data?: T
  data_base64?: string
  datacontenttype?: string
  dataschema?: string
  // Extensions should not exist as it's own object, but instead
  // exist as properties on the event as siblings of the others
  [key: string]: unknown;

  constructor(ce: Partial<CloudEventV1<T>>) {
    const properties = { ...ce };

    this.id = (properties.id as string) || uuid()
    delete properties.id

    this.time = properties.time || new Date().toISOString()
    delete properties.time

    this.type = properties.type as string
    delete (properties as any).type

    this.source = properties.source as string
    delete (properties as any).source

    this.specversion = (properties.specversion as string) || '1.0'
    delete properties.specversion

    if (properties.datacontenttype) {
      this.datacontenttype = properties.datacontenttype
    }

    delete properties.datacontenttype

    this.subject = properties.subject
    delete properties.subject

    this.dataschema = properties.dataschema as string
    delete properties.dataschema

    this.data_base64 = properties.data_base64 as string

    if (this.data_base64) {
      this.data = base64AsBinary(this.data_base64) as unknown as T
    }

    delete properties.data_base64

    if (isBinary(properties.data)) {
      this.data_base64 = asBase64(properties.data as unknown as Buffer)
    }

    this.data = typeof properties.data !== "undefined" ? properties.data : this.data
    delete properties.data

    // finally process any remaining properties - these are extensions
    for (const [key, value] of Object.entries(properties)) {
      // Extension names should only allow lowercase a-z and 0-9 in the name
      // names should not exceed 20 characters in length
      if (!key.match(/^[a-z0-9]{1,20}$/)) {
        throw new Error(`invalid extension name: ${key}
CloudEvents attribute names MUST consist of lower-case letters ('a' to 'z')
or digits ('0' to '9') from the ASCII character set. Attribute names SHOULD
be descriptive and terse and SHOULD NOT exceed 20 characters in length.`)
      }

      this[key] = value
    }

    Object.freeze(this)
  }
}

export interface CloudEventV1<T = any>  {
  id: string
  specversion: string
  source: string
  type: string
  datacontenttype?: string
  dataschema?: string
  subject?: string
  time?: string
  data?: T
  data_base64?: string
  [key: string]: unknown
}

type TypeArray = Int8Array | Uint8Array | Int16Array | Uint16Array | 
  Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array

const base64AsBinary = (base64String: string): Uint8Array => {
  const toBinaryString = (base64Str: string): string => globalThisPolyfill.atob
    ? globalThisPolyfill.atob(base64Str)
    : Buffer.from(base64Str, "base64").toString("binary")

  return Uint8Array.from(toBinaryString(base64String), (c) => c.charCodeAt(0))
}

const isBinary = (v: unknown): boolean => ArrayBuffer.isView(v)

const isBuffer = (value: unknown): boolean => value instanceof Buffer

const asBuffer = (value: string | Buffer | TypeArray): Buffer =>
  isBinary(value)
    ? Buffer.from((value as unknown) as string)
    : isBuffer(value)
    ? (value as Buffer)
    : (() => {
        throw new TypeError("is not buffer or a valid binary")
      })()

const asBase64 = 
(value: string | Buffer | TypeArray): string => asBuffer(value).toString("base64")

const globalThisPolyfill = (function() {
  try {
    return globalThis
  }
  catch (e) {
    try {
      // eslint-disable-next-line no-restricted-globals
      return self
    }
    catch (e) {
      return global
    }
  }
}())
