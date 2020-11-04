const express = require('express')

async function createApp() {
  require('dotenv').config()

  const ex = express()

  // Start initializing
  await require('./loaders/express')(ex)

  return ex
}

module.exports = {
  createApp
}
