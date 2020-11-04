const request = require('supertest')

describe('Route', () => {
  it('GET /metrics', async () => {
    const app = await require('../../src/app').createApp()
    await request(app)
      .get('/metrics')
      .expect('Content-Type', /text\/plain/)
      .expect(200, {})
  })
})
