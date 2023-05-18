const winston = require('winston')
const colorizer = require('logform/colorize')
const { isProduction } = require('./env')

/**
 * @type {winston.LoggerOptions}
 */
const opts = {
  level: isProduction ? 'info' : 'debug',
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.errors(),
    winston.format.splat(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss,SSS'
    }),
    winston.format.printf(info => {
      info.level = info.level.padStart(5).toUpperCase()
      colorizer().transform(info, { all: true })
      const { timestamp, level, message } = info

      return `${level} ${timestamp} ${message}`
    }),
  ),
  colorize: true,
}

const log = winston.createLogger(opts)

module.exports = {
  log,
  opts,
}
