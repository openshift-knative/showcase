(async () => {
  require('dotenv').config()

  const port = process.env.PORT
  const express = require('express')
  const app = express()
  
  // Start initializing
  await require('./loaders/express')(app)

  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`)
  })
})()
