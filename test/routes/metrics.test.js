const request = require('supertest')

describe('Route', () => {
  const app = require('../../src/app').createApp()
  it('GET /metrics', (done) => {
    request(app)
      .get('/metrics')
      .expect('Content-Type', /text\/plain/)
      .expect(200, {}, done)
  })
})
