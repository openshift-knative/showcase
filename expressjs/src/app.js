const express = require('express')
const dotenv = require('dotenv')

const middleware = {
  logging: require('./middleware/logging'),
  public: require('./middleware/public'),
  metrics: require('./middleware/metrics'),
  openapi: require('./middleware/openapi'),
  health: require('./middleware/health'),
  json: require('./middleware/json'),
}

const routes = {
  home: require('./routes/home/endpoint'),
  info: require('./routes/info/endpoint'),
  hello: require('./routes/hello/endpoint'),
  events: require('./routes/events/endpoint'),
}

const loaders = app => {
  // Middleware Functions
  middleware.logging(app)
  middleware.public(app)
  middleware.metrics(app)
  middleware.health(app)
  middleware.json(app)
  middleware.openapi(app)

  // Routing
  routes.home(app)
  routes.info(app)
  routes.hello(app)
  routes.events(app)
}

const createApp = () => {
  dotenv.config()

  const ex = express()

  // Start initializing
  loaders(ex)

  return ex
}

module.exports = createApp
