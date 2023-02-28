const { Project, Platform } = require('../domain/entity/project')
const { isDirectory } = require('./fs')
const packageJson = require('../../package.json')

async function resolveGitDescribe() {
  return new Promise((resolve, reject) => {
    const { gitDescribe } = require('git-describe')
    gitDescribe((err, desc) => {
      if (err) {
        reject()
        return
      }
      if (!desc.dirty && desc.distance === 0) {
        resolve(desc.tag)
        return
      }
      resolve(desc.raw)
    })
  })
}

async function computeGitDescribe() {
  if (await isDirectory('../.git')) {
    return await resolveGitDescribe()
  }
  return cachedGitDescribe()
}

function cachedGitDescribe() {
  return require('../../build/git-describe')
}

function resolveExpressVersion() {
  const json = require('express/package.json')
  return json.version
}

/**
 * @returns {Platform}
 */
function resolvePlatform() {
  return new Platform({
    node: process.version.replace(/^v/, ''),
    express: resolveExpressVersion()
  })
}

/**
 * @returns {Project}
 */
async function resolveProject() {
  const git = await computeGitDescribe()
  const platform = resolvePlatform()

  const parts = packageJson.name.split('/', 2)
  const group = parts.length === 2 ? parts[0].replace(/^@/, '') : null
  const artifact = parts.length === 2 ? parts[1] : parts[0]

  return new Project({
    group,
    artifact,
    version: git,
    platform
  })
}

module.exports = {
  resolveProject,
  resolveGitDescribe
}
