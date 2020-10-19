const gitSemverTag = require('git-semver-tags')
const gitRemoteOriginUrl = require('git-remote-origin-url');

async function getTagName() {
  return new Promise((resolve, reject) => {
    gitSemverTag((err, tags) => {
      if (err) {
        reject();
        return;
      }
      resolve(tags);
    })
  })
}

async function getProjectDetails() {
  const url = await gitRemoteOriginUrl()
  const tags = await getTagName()

  return {
    artifactId: url,
    version: tags[0],
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
