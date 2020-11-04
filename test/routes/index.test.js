const request = require('supertest')

describe('Route', () => {
  const app = require('../../src/app').createApp()
  it('OPTIONS /', async () => {
    await request(await app)
      .options('/')
      .expect('Content-Type', /application\/json/)
      .expect(200)
  })

  it('GET /', async () => {
    await request(await app)
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect(200)
  })
})
