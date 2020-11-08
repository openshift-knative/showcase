const { exec } = require('child_process')
const { gitDescribe } = require('git-describe')
const { Project, Platform } = require('../domain/entity/project')
const { isDirectory } = require('./fs')
const packageJson = require('../../package.json')

async function resolveGitDescribe() {
  return new Promise((resolve, reject) => {

    gitDescribe((err, desc) => {
      if (err) {
        reject()
        return
      }
      resolve(desc.raw)
    })
  })
}

async function computeGitDescribe() {
  if (await isDirectory('.git')) {
    return await resolveGitDescribe()
  }
  return cachedGitDescribe()
}

function cachedGitDescribe() {
  return require('../../build/git-describe')
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
  const git = await computeGitDescribe()
  const platform = await resolvePlatform()

  return new Project({
    artifact: packageJson.name,
    version: git,
    platform
  })
}

module.exports = {
  resolveProject,
  resolveGitDescribe
}
