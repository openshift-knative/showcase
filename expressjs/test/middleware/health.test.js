const request = require('supertest')
const createApp = require('../../src/app')
const { expect, describe, it } = require('@jest/globals')

describe('Route', () => {
  const app = createApp()
  it('GET /health/ready', async () => {
    const res = await request(app)
      .get('/health/ready')
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toEqual({ checks: [], status: 'UP' })
  })

  it('GET /health/live', async () => {
    const res = await request(app)
      .get('/health/live')
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toEqual({ checks: [], status: 'UP' })
  })
})
