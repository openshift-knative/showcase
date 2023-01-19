const request = require('supertest')

describe('Route', () => {
  const app = require('../../src/app').createApp()
  it('GET /health/ready', async () => {
    await request(await app)
      .get('/health/ready')
      .expect('Content-Type', /application\/json/)
      .expect(200, { checks: [], status: 'UP' })
  })

  it('GET /health/live', async () => {
    await request(await app)
      .get('/health/live')
      .expect('Content-Type', /application\/json/)
      .expect(200, { checks: [], status: 'UP' })
  })
})
