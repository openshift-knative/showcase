const request = require('supertest')

describe('Route', () => {
  const app = require('../../src/app').createApp()
  it('OPTIONS /', (done) => {
    request(app)
      .options('/')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .end((err, _) => {
        if (err) {
          return done(err)
        }
        done()
      })
  })

  it('GET /', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect(200)
      .end((err, _) => {
        if (err) {
          return done(err)
        }
        done()
      })
  })
})
