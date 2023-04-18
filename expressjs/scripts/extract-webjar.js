const AdmZip = require('adm-zip')
const fs = require('fs').promises
const chalk = require('chalk')
const path = require('path')

class Webjar {

  /**
   * Webjar stores the information about the webjar extraction.
   *
   * @param {Object} vars - The variables to use.
   * @param {string} vars.group - The group of the webjar.
   * @param {string} vars.artifact - The artifact of the webjar.
   * @param {string} vars.version - The version of the webjar.
   * @param {string} vars.color - The chalk color func to use.
   * @param {string} vars.source - The source directory in webjar to extract.
   * @param {string} vars.target - The target directory to extract the webjar to.
   */
  constructor({ group, artifact, version, color, source, target }) {
    this.group = group
    this.artifact = artifact
    this.version = version
    this.color = color
    this.source = source
    this.target = target
  }
}

const webjars = [
  new Webjar({
    group: 'com.redhat.openshift.knative.showcase',
    artifact: 'frontend',
    version: 'main',
    color: chalk.cyan,
    source: 'META-INF/resources',
    target: 'public',
  }),
  new Webjar({
    group: 'com.redhat.openshift.knative.showcase',
    artifact: 'cloudevents-pp-wasm',
    version: 'main',
    color: chalk.magenta,
    source: 'META-INF',
    target: 'build/wasm',
  }),
]

/**
 * Extracts all webjars.
 */
async function extractWebjars() {
  let ps = []
  for (const webjar of webjars) {
    ps.push(extractWebjar(webjar))
  }
  return await Promise.all(ps)
}

/**
 * @callback Log
 * @param {string} message
 * @param {...any} args
 */

/**
 * Creates a log function for the given webjar.
 *
 * @param {Webjar} webjar
 * @returns {Log}
 */
function createLog(webjar) {
  return (...message) => {
    console.log(`[${webjar.color(webjar.artifact)}]`, ...message)
  }
}

/**
 * Extracts the webjar to the target directory.
 *
 * @param {Webjar} webjar
 */
async function extractWebjar(webjar) {
  const log = createLog(webjar)
  const jarDir = `${process.env.HOME}/.m2/repository/${webjar.group.replace(/\./g, '/')}/${webjar.artifact}/${webjar.version}`
  const jarPath = `${jarDir}/${webjar.artifact}-${webjar.version}.jar`

  const zip = new AdmZip(jarPath)
  const zipEntries = zip.getEntries()
  
  log(`Deleting ${chalk.red(webjar.target)} directory\n`)
  await fs.rm(webjar.target, { recursive: true, force: true })
  
  log(`Extracting ${chalk.cyan(jarPath)} to ${chalk.green(webjar.target)}\n`)

  zipEntries.forEach(async zipEntry => {
    // outputs zip entries information
    if (zipEntry.entryName.startsWith(webjar.source) && !zipEntry.isDirectory) {
      const targetPath = zipEntry.entryName
        .replace(webjar.source, webjar.target)
      log(`${chalk.yellow(zipEntry.entryName)} -> ${chalk.green(targetPath)}`)

      const targetDir = path.dirname(targetPath)
      await fs.mkdir(targetDir, { recursive: true })
      await fs.writeFile(targetPath, zipEntry.getData())
    }
  })
  log(`Extracting the webjar is ${chalk.green('Done')}.\n`)
}

module.exports = () => {
  extractWebjars()
}
