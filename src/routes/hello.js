const { Greeter } = require('../services/hello')
const { getSink } = require('../services/config')

module.exports = (app) => {

  app.get('/hello', async (req, res) => {

    const greeter = new Greeter(getSink)
    const result = await greeter.hello({ who: req.query.who || 'anonymous' })

    if (result.success) {
      res.json(result.data)
    } else {
      res.status('400')
      res.json(result.data.message)
    }

  })

}
