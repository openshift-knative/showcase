module.exports = (app) => {
  let number = 0

  app.get('/hello', (req, res) => {
    res.json({
      hello: req.query.who || 'anonymous',
      number: ++number
    })
  })

}
