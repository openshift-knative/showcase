const express = require('express')
const morgan = require('morgan')

module.exports = (app) => {

  app.use(morgan('dev', {
    skip(_, res) {
      return typeof jest !== 'undefined' && res.statusCode < 400
    }
  }))
  app.use(express.static('public'))

}
