(async () => {
  const app = await require('./app').createApp()

  const port = require('./services/config').port()

  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`)
  })
})()
