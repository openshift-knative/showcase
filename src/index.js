const express = require('express')

const DEFAULT_PORT = 21111
const port = process.env.PORT || DEFAULT_PORT;

(async () => {
  const app = express()

  require('dotenv').config()

  // Start initializing
  await require('./loaders/express')(app)

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
})()
