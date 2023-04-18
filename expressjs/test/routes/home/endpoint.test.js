const request = require('supertest')
const createApp = require('../../../src/app')
const { expect, describe, it } = require('@jest/globals')

describe('Route', () => {
  const app = createApp()
  it('GET /', async () => {
    const res = await request(await app).get('/')

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toEqual({
      artifact: 'knative-showcase',
      greeting: 'Welcome'
    })
  })

  it('GET / as Browser', async () => {
    const res = await request(await app)
      .get('/')
      .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36')
    
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/text\/html/)
  })
})
