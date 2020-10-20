const { resolveProject } = require('../services/project')

module.exports = (app) => {
  app.get('/', async (_, res) => {
    try {
      const project = await resolveProject()
      res.render('index', { project })
    } catch (err) {
      console.error(err)
      res.status(500)
      res.json(err)
    }
  })

  app.options('/', async (_, res) => {
    try {
      const project = await resolveProject()
      res.json(project)
    } catch (err) {
      console.error(err)
      res.status(500)
      res.json(err)
    }
  })
}
