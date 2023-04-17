import AdmZip from 'adm-zip'
import fs from 'fs/promises'
import os from 'os'
import { green, yellow, cyan, magenta, Color, blue, white } from 'colorette'
import { WasmRegistry, Image } from 'wasm-oci'

type Packager = (packer: Packer, log: Logger) => Promise<void>

interface Packer {
  /**
   * Adds a file from the disk to the archive.
   * @param localPath Path to a file on disk.
   * @param zipPath Path to a directory in the archive. Defaults to the empty
   *   string.
   * @param zipName Name for the file.
   * @param comment Comment to be attached to the file
   */
  addLocalFile(localPath: string, zipPath?: string, zipName?: string, comment?: string): void
  /**
   * Adds a local directory and all its nested files and directories to the
   * archive.
   * @param localPath Path to a folder on disk.
   * @param zipPath Path to a folder in the archive. Default: `""`.
   * @param filter RegExp or Function if files match will be included.
   */
  addLocalFolder(localPath: string, zipPath?: string, filter?: (path: string) => boolean): void
  /**
   * Allows you to create a entry (file or directory) in the zip file.
   * If you want to create a directory the `entryName` must end in `"/"` and a `null`
   * buffer should be provided.
   * @param entryName Entry path.
   * @param content Content to add to the entry; must be a 0-length buffer
   *   for a directory.
   * @param comment Comment to add to the entry.
   * @param attr Attribute to add to the entry.
   */
  addFile(entryName: string, content: Buffer, comment?: string, attr?: number): void
}

interface Webjar {
  group: string
  artifact: string
  version: string
  color: Color,
  build: Packager
}

const webjars: Webjar[] = [{
  group: 'com.redhat.openshift.knative.showcase',
  artifact: 'frontend',
  version: 'main',
  color: cyan,
  build: async p => {
    p.addLocalFolder('./build', 'META-INF/resources', (path) => {
      return !path.includes('index.html')
    })
    p.addLocalFile('./build/index.html', 'META-INF/resources', 'home.html')
  }
}, {
  group: 'com.redhat.openshift.knative.showcase',
  artifact: 'cloudevents-pp-wasm',
  version: 'main',
  color: magenta,
  build: async (p, log) => {
    const tmpDir = os.tmpdir()
    const tmp = await fs.mkdtemp(`${tmpDir}/wasm-oci-`)
    const reg = new WasmRegistry(tmp)
    const image = Image.parse('quay.io/cardil/cloudevents-pretty-print@sha256:01b30983dda5eb42a8baefb523eb50d7d0e539fb10d7ab9498a2a59f35036afb')
    log(`Pulling image: ${green(image.toString())}`)
    const wasm = await reg.pull(image)
    p.addFile('META-INF/cloudevents-pretty-print.wasm', await fs.readFile(wasm.file), 'Wasm')
    await fs.rm(tmp, { recursive: true })
  }
}]

type Logger = (message?: any, ...optionalParams: any[]) => void

function createLogger(name: string): Logger {
  return (msg) => {
    console.log(`[${name}] ${msg}`)
  }
}

async function buildWebjar(webjar: Webjar) {
  const log = createLogger(webjar.color(webjar.artifact))
  const jarDir = `${process.env.HOME}/.m2/repository/` +
    `${webjar.group.replace(/\./g, '/')}/` +
    `${webjar.artifact}/` + webjar.version
  const jarPath = `${jarDir}/${webjar.artifact}-${webjar.version}.jar`
  const pomPath = `${jarDir}/${webjar.artifact}-${webjar.version}.pom`

  const pom = `<?xml version="1.0" encoding="UTF-8"?>
  <project xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd"
  xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<modelVersion>4.0.0</modelVersion>
<groupId>${webjar.group}</groupId>
<artifactId>${webjar.artifact}</artifactId>
<version>${webjar.version}</version>
<packaging>jar</packaging>
// Build by: forntend/scripts/webjar.ts script
</project>
`
  const zip = new AdmZip()
  await webjar.build(zip, log)
  zip.addFile(`META-INF/maven/${webjar.group}/${webjar.artifact}/pom.xml`, Buffer.from(pom))
  zip.writeZip(jarPath)
  log(`Created webjar: ${yellow(jarPath)}`)
  await fs.writeFile(pomPath, pom)
  log(`Created webjar POM: ${yellow(pomPath)}`)
  log('To use it, add following to your pom.xml file:\n' + blue(
    `
    <dependency>
      <groupId>${white(webjar.group)}</groupId>
      <artifactId>${white(webjar.artifact)}</artifactId>
      <version>${white(webjar.version)}</version>
    </dependency>
  `))
}

async function build() {
  const ps : Promise<void>[] = []
  for (const webjar of webjars) {
    ps.push(buildWebjar(webjar))
  }
  await Promise.all(ps)
}

build()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .then(() => process.exit(0))
