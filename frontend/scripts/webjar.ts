import AdmZip from 'adm-zip'
import fs from 'fs'
import { green, yellow } from 'colorette'

const coords = {
  group: 'com.redhat.openshift.knative.showcase',
  artifact: 'frontend',
  version: 'main',
}

const jarDir = `${process.env.HOME}/.m2/repository/` +
  `${coords.group.replace(/\./g, '/')}/` +
  `${coords.artifact}/` + coords.version
const jarPath = `${jarDir}/${coords.artifact}-${coords.version}.jar`
const pomPath = `${jarDir}/${coords.artifact}-${coords.version}.pom`

const pom = `<?xml version="1.0" encoding="UTF-8"?>
<project xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd"
    xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <modelVersion>4.0.0</modelVersion>
  <groupId>${coords.group}</groupId>
  <artifactId>${coords.artifact}</artifactId>
  <version>${coords.version}</version>
  <packaging>jar</packaging>
  // Build by: forntend/scripts/webjar.ts script
</project>
`

const zip = new AdmZip()
zip.addLocalFolder('./build', 'META-INF/resources', (path) => {
  return !path.includes('index.html')
})
zip.addLocalFile('./build/index.html', 'META-INF/resources', 'home.html')
zip.addFile(`META-INF/maven/${coords.group}/${coords.artifact}/pom.xml`, Buffer.from(pom))
zip.writeZip(jarPath)
console.log(`Created webjar: ${yellow(jarPath)}`)
fs.writeFileSync(pomPath, pom)
console.log(`Created webjar POM: ${yellow(pomPath)}`)
console.log('\nTo use it, add following to your pom.xml file:\n\n' + green(
  `
  <dependency>
    <groupId>${coords.group}</groupId>
    <artifactId>${coords.artifact}</artifactId>
    <version>${coords.version}</version>
  </dependency>
`))
