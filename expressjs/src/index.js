const createApp = require('./app')
const config = require('./lib/config')

const main = async () => {

  const app = await createApp()

  const port = config.port()

  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`)
  })
}

main()
