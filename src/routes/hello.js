const { Greeter } = require('../services/greeter')
const { sink, greeting } = require('../services/config')

module.exports = (app) => {

  app.get('/hello', async (req, res) => {

    const greeter = new Greeter(sink, greeting)
    const who = req.query.who || 'Person'
    const hello = await greeter.hello({ who })

    res.json(hello)
  })

}
