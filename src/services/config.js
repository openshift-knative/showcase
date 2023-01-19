function sink() {
  return process.env.K_SINK
}

function greeting() {
  return process.env.GREETING
}

function delay() {
  let d = parseInt(process.env.DELAY, 10)
  if (isNaN(d) || d < 0) {
    return 0
  }
  return d
}

module.exports = {
  sink,
  greeting,
  delay
}
