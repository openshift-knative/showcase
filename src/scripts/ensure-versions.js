const { resolveProject } = require('../services/project')
const semver = require('semver')
const fs = require('fs').promises
const path = require('path')

function ensureVersions() {
  doEnsureVersions()
    .catch(console.error)
}

async function doEnsureVersions() {
  const project = await resolveProject()
  let projectVersion = new semver.SemVer(project.version)
  if (projectVersion.prerelease.length > 0) {
    projectVersion = semver.coerce(projectVersion.toString()).inc('patch')
  }
  const packageJson = require('../../package.json')
  packageJson.version = projectVersion.toString()

  const content = JSON.stringify(packageJson, null, 2)
  fs.writeFile(path.resolve(__dirname, '..', '..', 'package.json'), `${content}\n`)
}

module.exports = ensureVersions
