const AdmZip = require('adm-zip')
const fs = require('fs').promises
const chalk = require('chalk')
const path = require('path')

const coords = {
  group: 'com.redhat.openshift.knative.showcase',
  artifact: 'frontend',
  version: 'main',
}

const jarDir = `${process.env.HOME}/.m2/repository/${coords.group.replace(/\./g, '/')}/${coords.artifact}/${coords.version}`
const jarPath = `${jarDir}/${coords.artifact}-${coords.version}.jar`

const extractWebjar = async () => {
  const zip = new AdmZip(jarPath)
  const zipEntries = zip.getEntries()
  
  console.log(`Extracting ${chalk.cyan(jarPath)} to ${chalk.green('public')}\n`)

  console.log(`Deleting ${chalk.red('public')} directory\n`)
  await fs.rm('public', { recursive: true, force: true })

  zipEntries.forEach(async zipEntry => {
    // outputs zip entries information
    if (zipEntry.entryName.startsWith('META-INF/resources') && !zipEntry.isDirectory) {
      const targetPath = zipEntry.entryName.replace('META-INF/resources', 'public')
      console.log(`${chalk.yellow(zipEntry.entryName)} -> ${chalk.green(targetPath)}`)

      const targetDir = path.dirname(targetPath)
      await fs.mkdir(targetDir, { recursive: true })
      await fs.writeFile(targetPath, zipEntry.getData())
    }
  })
  console.log(`\nExtracting the webjar is ${chalk.green('Done')}.\n`)
}

module.exports = () => {
  extractWebjar()
}
