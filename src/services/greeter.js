const { Hello } = require('../domain/entity/hello')
const { Notifier } = require('./notifier')

let number = 0

class Greeter {
  constructor({ sink, greeting, delay }) {
    
    /**
     * @type {Notifier}
     */
    this.notifier = new Notifier({ sink })

    /**
     * @type {() => string}
     */
    this.greeting = greeting

    /**
     * @type {() => Number}
     */
    this.delay = delay
  }

  /**
   * @param {string} who
   * @returns {Hello}
   */
  async hello(who) {
    const hello = new Hello({
      greeting: this.greeting(),
      who,
      number: ++number
    })
    await this.notifier.notifyFor(hello)
    const d = this.delay()
    await sleep(d)
    return hello
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

module.exports = {
  Greeter
}
