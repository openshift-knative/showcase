const request = require('supertest')
const createApp = require('../../src/app')

describe('Route', () => {
  it('GET /metrics', async () => {
    const app = await createApp()
    await request(app)
      .get('/metrics')
      .expect('Content-Type', /text\/plain/)
      .expect(200, {})
  })
})
