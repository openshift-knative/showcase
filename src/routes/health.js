const STATUS = {
  UP: 'UP',
  DOWN: 'DOWN',
}

module.exports = (app) => {

  app.get('/health/ready', (req, res) => {
    res.json({
      checks: [],
      status: STATUS.UP
    })
  })

  app.get('/health/live', (req, res) => {
    res.json({
      checks: [],
      status: STATUS.UP
    })
  })

}
