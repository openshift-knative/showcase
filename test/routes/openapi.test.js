const request = require('supertest')

describe('Route', () => {
  const app = require('../../src/app').createApp()
  it('GET /swagger-ui/', async () => {
    await request(await app)
      .get('/swagger-ui/')
      .expect('Content-Type', /text\/html/)
      .expect(200)
  })

  it('GET /openapi.json', async () => {
    await request(await app)
      .get('/openapi.json')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.openapi).toEqual('3.0.0')
        expect(res.body.info.description).toEqual('Knative Serving Showcase for JS')
        expect(Object.keys(res.body.paths).sort()).toEqual([
          '/',
          '/hello',
          '/health/live',
          '/health/ready'
        ].sort())
      })
  })
})
