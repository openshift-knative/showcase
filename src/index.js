(async () => {
  const app = require('./app').createApp()
  
  const port = process.env.PORT
  
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`)
  })
})()
