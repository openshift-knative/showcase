const request = require('supertest')
const createApp = require('../../src/app')
const { expect, describe, it } = require('@jest/globals')

describe('Route', () => {
  const app = createApp()
  it('GET /swagger-ui/', async () => {
    const res = await request(app)
      .get('/swagger-ui/')
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/text\/html/)
  })

  it('GET /openapi.json', async () => {
    const res = await request(app)
      .get('/openapi.json')
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body.openapi).toEqual('3.0.0')
    expect(res.body.info.description).toEqual('Knative Showcase for JS')
    expect(Object.keys(res.body.paths).sort()).toEqual([
      '/',
      '/events',
      '/hello',
      '/health/live',
      '/health/ready',
      '/info'
    ].sort())
  })
})
