const express = require('express')

function createApp() {
  require('dotenv').config()

  const ex = express()

  // Start initializing
  require('./loaders/express')(ex)

  return ex
}

module.exports = {
  createApp
}
