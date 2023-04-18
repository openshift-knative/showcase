const request = require('supertest')
const createApp = require('../../../src/app')
const { expect, describe, it } = require('@jest/globals')

describe('Route', () => {
  it('GET /info', async () => {
    const app = await createApp()
    const res = await request(app)
      .get('/info')
    
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toHaveProperty('project')
    const project = res.body.project
    expect(project.group).toEqual('openshift')
    expect(project.artifact).toEqual('knative-showcase')
    expect(project.version).toMatch(/^.+$/)
    expect(project.platform).toMatch(/Express\/\d+\.\d+\.\d+ Node\/\d+\.\d+\.\d+/)
    expect(res.body).toHaveProperty('config')
    const config = res.body.config
    expect(config).toEqual({
      sink: 'http://localhost:31111',
      greet: 'Welcome',
      delay: 0
    })
  })
})
