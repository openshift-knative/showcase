const { hello } = require('../services/hello')

module.exports = (app) => {

  app.get('/hello', async (req, res) => {

    const result = await hello({ who: req.query.who || 'anonymous' })

    if (result.success) {
      res.json(result.data)
    } else {
      res.status('400')
      res.json(result.data.message)
    }

  })

}
