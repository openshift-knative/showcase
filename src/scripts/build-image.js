const shell = require('shelljs')
const chalk = require('chalk')

function buildImage(name) {
  require('dotenv').config()
  
  const basename = process.env.CONTAINER_BASENAME
  console.info(chalk.greenBright(`📦 Packaging OCI image: ${name}`))
  container(`build -f deployment/Dockerfile -t ${basename}${name} .`).then((code) => {
    if (code !== 0) {
      throw new Error(`Process exited with ${code} retcode`)
    }
  })
}

function container(args) {
  const eng = resolveContainerEngine()
  return stream(eng, `${eng} ${args}`)
}

function stream(label, command) {
  return new Promise((resolve) => {
    const child = shell.exec(command, { async: true, silent: true })
    child.stdout.on('data', (data) => {
      for (const line of data.trimRight('\n').split('\n')) {
        const tag = chalk.blue(`[${label}]`)
        console.log(`${tag} ${line}`)
      }
    })
    child.stderr.on('data', (data) => {
      for (const line of data.trimRight('\n').split('\n')) {
        const tag = chalk.red(`[${label}]`)
        console.log(`${tag} ${line}`)
      }
    })
    child.on('exit', (code) => {
      resolve(code)
    })
  })
}

function resolveContainerEngine() {
  if (shell.which('podman')) {
    return 'podman'
  }
  if (shell.which('docker')) {
    return 'docker'
  }
  throw new Error('Can\'t find a installed container engine. Install podman or docker.')
}

module.exports = buildImage
