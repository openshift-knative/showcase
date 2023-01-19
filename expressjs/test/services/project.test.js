const { resolveProject } = require('../../src/services/project')
const semver = require('semver')

expect.extend({
  toMatchGitDescribeVersion(v1, v2) {
    let projectVersion = new semver.SemVer(v1)
    let gitDescribe = new semver.SemVer(v2)
    if (projectVersion.prerelease.length === 1 && projectVersion.prerelease[0] === 'pre') {
      projectVersion = semver.coerce(projectVersion.toString())
    }
    if (gitDescribe.prerelease.length > 0) {
      gitDescribe = semver.coerce(gitDescribe.toString()).inc('patch')
    }
    const pass = semver.eq(projectVersion, gitDescribe)
    const message = () =>
      `expected ${v1} to match GIT describe version of ${v2}`
    return { message, pass }
  },
})

describe('project', () => {
  it('resolve', async () => {
    const project = await resolveProject()
    expect(project.artifact).toEqual('@cardil/knative-serving-showcase')
    // ref: https://regex101.com/r/SqE4A0/1
    expect(project.version).toMatch(/^v\d+\.\d+\.\d+(?:-\d+-g[0-9a-f]{7}(?:-dirty)?)?$/)
    expect(project.platform.node).toMatch(/^v\d+\.\d+\.\d+$/)
    expect(project.platform.npm).toMatch(/^v\d+\.\d+\.\d+$/)
  })

  it('ensureVersionIsConsistent', async () => {
    const projectJson = require('../../package.json')
    const project = await resolveProject()
    expect(projectJson.version).toMatchGitDescribeVersion(project.version)
  })
})

