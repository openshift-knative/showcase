const axios = require('axios').default;
const { HTTP, CloudEvent } = require("cloudevents");


module.exports = (app) => {
  let number = 0

  app.get('/hello', async (req, res) => {
    const type = 'io.github.cardil.knsvng.domain.entity.Hello'
    const source = '//events/serving-showcase'
    const data = {
      greeting: 'Hello',
      number: ++number,
      who: req.query.who || 'anonymous',
    }
    const url = process.env.K_SINK || 'http://localhost:31111'

    const ce = new CloudEvent({ type, source, data })
    const message = HTTP.binary(ce)

    try {
      await axios({
        method: 'post',
        url,
        data: message.body,
        headers: message.headers,
      })
      console.log(`Event ${ce.id} sent to ${url}`)
      res.json(data)
    } catch (err) {
      console.error(err)
      res.json({
        error: err.message
      })
    }

  })

}
