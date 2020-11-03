const { resolveProject } = require('../../src/services/project')

it('resolveProject', async () => {
  const project = await resolveProject()

  expect(project.artifact).toEqual('@cardil/knative-serving-showcase')
  // ref: https://regex101.com/r/SqE4A0/1
  expect(project.version).toMatch(/^v\d+\.\d+\.\d+(?:-\d+-g[0-9a-f]{7}(?:-dirty)?)?$/)
  expect(project.platform.node).toMatch(/^v\d+\.\d+\.\d+$/)
  expect(project.platform.npm).toMatch(/^v\d+\.\d+\.\d+$/)
})
