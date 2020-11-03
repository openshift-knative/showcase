const request = require('supertest')
const nock = require('nock')

describe('Route', () => {
  const app = require('../../src/app').createApp()
  it('GET /hello?who=James', async () => {
    let counter = 0
    jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn())

    await nock('http://localhost:31111')
      .post('/')
      .reply((_uri, _body) => {
        counter++
        return [201, 'OK']
      })

    await request(app)
      .get('/hello')
      .query({ who: 'James' })
      .expect('Content-Type', /application\/json/)
      .expect(200, {
        who: 'James',
        number: 1,
        greeting: 'Hello'
      })

    expect(counter).toEqual(1)
  })

})
