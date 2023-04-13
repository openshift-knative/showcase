const nodeenv = process.env.NODE_ENV || 'development'
const isProduction = nodeenv === 'production'

module.exports = {
  isProduction,
}
