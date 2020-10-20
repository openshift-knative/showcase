const Status = {
  UP: 'UP',
  DOWN: 'DOWN',
}

module.exports = (app) => {

  app.get('/health/ready', (_, res) => {
    res.json({
      checks: [],
      status: Status.UP
    })
  })

  app.get('/health/live', (_, res) => {
    res.json({
      checks: [],
      status: Status.UP
    })
  })

}
