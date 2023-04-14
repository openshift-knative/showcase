const { isDirectory } = require('./fs.js')
const packageJson = require('../../package.json')

class Project {
  constructor({ group, artifact, version, platform }) {

    /**
     * @type {string}
     */
    this.group = group

    /**
     * @type {string}
     */
    this.artifact = artifact

    /**
     * @type {string}
     */
    this.version = version

    /**
     * @type {string}
     */
    this.platform = platform
  }
}

async function resolveGitDescribe() {
  const { gitDescribeSync } = require('git-describe')
  return gitDescribeSync(__dirname)
    .raw
    .replace(/-dirty$/, '')
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
 * @returns {string}
 */
function resolvePlatform() {
  const platform = {
    node: process.version.replace(/^v/, ''),
    express: resolveExpressVersion()
  }
  return `Express/${platform.express} Node/${platform.node}`
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
  Project,
  resolveProject,
  resolveGitDescribe
}
