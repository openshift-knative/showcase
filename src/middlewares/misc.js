const express = require('express')
const morgan = require('morgan')

module.exports = (app) => {

  app.use(morgan('dev'))
  app.use(express.static('public'))

}
