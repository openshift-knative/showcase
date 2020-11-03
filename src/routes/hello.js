const { Greeter } = require('../services/greeter')

module.exports = (app) => {

  app.get('/hello', async (req, res) => {

    const greeter = new Greeter(require('../services/config'))
    const who = req.query.who || 'Person'
    const hello = await greeter.hello(who)

    res.json(hello)
  })

}
