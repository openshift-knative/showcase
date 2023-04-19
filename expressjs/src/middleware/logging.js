const expressWinston = require('express-winston')
const { opts } = require('../lib/logging')
const { isProduction } = require('../lib/env')

/**
 * @typedef {import('express').Express} Express
 */


/**
 * Configure logging middleware
 *
 * @param {Express} app - Express app
 */
module.exports = app => {

  if (isProduction) {
    return
  }
  
  app.use(expressWinston.logger({
    ...opts,
    ...{
      meta: true,
      expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
      ignoreRoute: (_req, _res) => {
        return typeof jest !== 'undefined'
      }
    }
  }))

}
