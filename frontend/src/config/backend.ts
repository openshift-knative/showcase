const nodeenv = process.env.NODE_ENV ?? 'development'

const shouldStubBackend = process.env.REACT_APP_BACKEND === undefined && (
  nodeenv === 'development' || nodeenv === 'test'
)

const baseAddress = process.env.BACKEND ?? 'http://localhost:8080'

export {
  shouldStubBackend,
  baseAddress
}
