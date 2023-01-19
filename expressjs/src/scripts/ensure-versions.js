const { resolveProject } = require('../services/project')
const fs = require('fs').promises
const path = require('path')

function ensureVersions() {
  doEnsureVersions()
    .catch(console.error)
}

async function doEnsureVersions() {
  const project = await resolveProject()
  const packageJson = require('../../package.json')
  packageJson.version = project.versionForNpm()

  const content = JSON.stringify(packageJson, null, 2)
  fs.writeFile(path.resolve(__dirname, '..', '..', 'package.json'), `${content}\n`)
}

module.exports = ensureVersions
