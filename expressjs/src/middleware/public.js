const express = require('express')

/**
 * @param {express.Express} app the app
 */
module.exports = app => {
  app.use(express.static('public', { index: false }))
}
