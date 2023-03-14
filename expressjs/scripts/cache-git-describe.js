const { resolveGitDescribe } = require('../src/lib/project')
const { isDirectory } = require('../src/lib/fs')
const fs = require('fs').promises
const path = require('path')
const chalk = require('chalk')

function cacheGitDescribe() {
  doCacheGitDescribe().catch(reason => {
    throw reason
  })
}

async function doCacheGitDescribe() {
  const info = await resolveGitDescribe()
  const buildPath = path.resolve(__dirname, '..', 'build')
  if (!await isDirectory(buildPath)) {
    await fs.mkdir(buildPath)
  }
  const cachePath = path.resolve(buildPath, 'git-describe.js')
  await fs.writeFile(cachePath, `module.exports = '${info}'\n`)

  console.log(`Cached git describe: ${chalk.yellow(info)}`)
}

module.exports = cacheGitDescribe
