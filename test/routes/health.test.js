const request = require('supertest')

describe('Route', () => {
  const app = require('../../src/app').createApp()
  it('GET /health/ready', (done) => {
    request(app)
      .get('/health/ready')
      .expect('Content-Type', /application\/json/)
      .expect(200, { checks: [], status: 'UP' }, done)
  })

  it('GET /health/live', (done) => {
    request(app)
      .get('/health/live')
      .expect('Content-Type', /application\/json/)
      .expect(200, { checks: [], status: 'UP' }, done)
  })
})
