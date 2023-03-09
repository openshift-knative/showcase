const { resolveProject } = require('../../src/lib/project')

describe('project', () => {
  it('resolve', async () => {
    const project = await resolveProject()
    expect(project.group).toEqual('openshift')
    expect(project.artifact).toEqual('knative-showcase')
    // ref: https://regex101.com/r/SqE4A0/1
    expect(project.version).toMatch(/^v\d+\.\d+\.\d+(?:-\d+-g[0-9a-f]{7}(?:-dirty)?)?$/)
    expect(project.platform).toMatch(/^Express\/\d+\.\d+\.\d+ Node\/\d+\.\d+\.\d+$/)
  })
})

