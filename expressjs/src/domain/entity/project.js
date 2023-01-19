class Platform {
  constructor({ node, npm }) {

    /**
     * @type {string}
     */
    this.node = node

    /**
     * @type {string}
     */
    this.npm = npm
  }
}

class Project {
  constructor({ artifact, version, platform }) {

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
}

module.exports = {
  Project,
  Platform
}
