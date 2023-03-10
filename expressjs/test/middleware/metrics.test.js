const request = require('supertest')
const createApp = require('../../src/app')
const { expect, describe, it } = require('@jest/globals')

describe('Route', () => {
  it('GET /metrics', async () => {
    const app = createApp()
    const res = await request(app)
      .get('/metrics')
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/text\/plain/)
  })
})
