const Joi = require('joi')

function sink() {
  return process.env.K_SINK || 'http://localhost:31111'
}

function greet() {
  return process.env.GREET || 'Welcome'
}

function delay() {
  return parseInt(process.env.DELAY || '0', 10)
}

function port() {
  return process.env.PORT || 8080
}

const config = {
  sink,
  greet,
  delay,
  port
}

const schema = Joi.object({
  sink: Joi.string()
    .uri({ scheme: /https?/ })
    .required(),

  greet: Joi.string()
    .pattern(new RegExp('^[A-Z][a-z]+$'))
    .required(),

  delay: Joi.number()
    .min(0)
    .required(),
  
  port: Joi.number()
    .min(0)
    .required()
})

const { error } = schema.validate({
  sink: config.sink(),
  greet: config.greet(),
  delay: config.delay(),
  port: config.port()
})
if (error) {
  throw error
}

module.exports = config
