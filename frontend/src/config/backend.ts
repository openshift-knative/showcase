const nodeenv = process.env.NODE_ENV ?? 'development'
const isProduction = nodeenv === 'production'

const shouldStubBackend = !isProduction &&
  process.env.REACT_APP_BACKEND === undefined

const defaultBackend = isProduction ? '' : 'http://localhost:8080'
const baseAddress = process.env.BACKEND ?? defaultBackend

export {
  shouldStubBackend,
  baseAddress
}
