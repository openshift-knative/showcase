const { gitDescribe } = require('git-describe')
const gitRemoteOriginUrl = require('git-remote-origin-url')

async function getDetails() {
  return new Promise((resolve, reject) => {
    gitDescribe((err, tags) => {
      if (err) {
        reject()
        return
      }
      resolve(tags)
    })
  })
}

async function getProjectDetails() {
  const url = await gitRemoteOriginUrl()
  const details = await getDetails()
  console.log(details)

  return {
    artifactId: url,
    version: details.raw,
    platformVersion: process.version,
  }
}


module.exports = (app) => {
  app.get('/', async (req, res) => {
    try {
      const project = await getProjectDetails()
      res.render('index', { project })
    } catch (err) {
      res.json(err)
    }
  })

  app.options('/', async (req, res) => {
    try {
      const project = await getProjectDetails()
      res.json(project)
    } catch (err) {
      res.json(err)
    }
  })
}
