const request = require('supertest')
const nock = require('nock')
const createApp = require('../../../src/app')
const { expect, describe, it } = require('@jest/globals')

describe('Route', () => {
  const app = createApp()
  it('GET /hello?who=James', async () => {
    let counter = 0
    jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn())

    nock('http://localhost:31111')
      .post('/')
      .reply((_uri, _body) => {
        counter++
        return [201, 'OK']
      })

    const res = await request(app)
      .get('/hello')
      .query({ who: 'James' })

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toEqual({
      who: 'James',
      number: 1,
      greeting: 'Welcome'
    })

    expect(counter).toEqual(1)
  })

  it('GET /hello?who=nobody', async () => {
    const res = await request(app)
      .get('/hello')
      .query({ who: 'nobody' })
    
    expect(res.status).toBe(400)
    expect(res.headers['content-type']).toMatch(/application\/json/)
  })

})
