const createApp = require('./app')
const config = require('./lib/config')
const { log } = require('./lib/logging')
const colors = require('@colors/colors')

const main = async () => {

  const app = await createApp()

  const port = config.port()

  app.listen(port, () => {
    const address = colors.cyan(colors.underline(
      `http://localhost:${port}/`))
    log.info(`Listening at ${address}`)
  })
}

main()
