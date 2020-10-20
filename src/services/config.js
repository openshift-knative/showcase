function sink() {
  return process.env.K_SINK
}

function greeting() {
  return process.env.GREETING
}

module.exports = {
  sink,
  greeting
}
