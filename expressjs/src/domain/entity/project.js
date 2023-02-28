const semver = require('semver')

class Platform {
  constructor({ node, express }) {

    /**
     * @type {string}
     */
    this.node = node

    /**
     * @type {string}
     */
    this.express = express
  }

  toString() {
    return `Express/${this.express} Node/${this.node}`
  }
}

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
     * @type {Platform}
     */
    this.platform = platform
  }

  versionForNpm() {
    let v = new semver.SemVer(this.version)
    if (v.prerelease.length > 0) {
      v = semver.coerce(v.toString()).inc('patch')
      v += '-pre'
    } else {
      v = v.toString()
    }
    return v
  }
}

module.exports = {
  Project,
  Platform
}
