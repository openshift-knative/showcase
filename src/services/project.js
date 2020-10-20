const { exec } = require('child_process')
const { gitDescribe } = require('git-describe')
const { Project, Platform } = require('../domain/entity/project')
const packageJson = require('../../package.json')

async function resolveGitDescribe() {
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

async function resolveNpmVersion() {
  return new Promise((resolve, reject) => {
    exec('npm -v', (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }
      if (stderr) {
        reject(stderr)
        return
      }
      resolve(`v${stdout.trim()}`)
    })
  })
}

/**
 * @returns {Platform}
 */
async function resolvePlatform() {
  return new Platform({
    node: process.version,
    npm: await resolveNpmVersion()
  })
}

/**
 * @returns {Project}
 */
async function resolveProject() {
  const git = await resolveGitDescribe()
  const platform = await resolvePlatform()

  return new Project({
    artifact: packageJson.name,
    version: git.raw,
    platform
  })
}

module.exports = {
  resolveProject
}
