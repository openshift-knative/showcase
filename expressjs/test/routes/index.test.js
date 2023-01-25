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
      .expect('Content-Type', /application\/json/)
      .expect(200)
  })

  it('GET / as Browser', async () => {
    await request(await app)
      .get('/')
      .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36')
      .expect('Content-Type', /text\/html/)
      .expect(200)
  })
})
