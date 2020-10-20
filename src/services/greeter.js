const { Hello } = require('../domain/entity/hello')
const { Notifier } = require('./notifier')

let number = 0

class Greeter {
  constructor(sink, greeting) {

    /**
     * @type {Notifier}
     */
    this.notifier = new Notifier({ sink })

    /**
     * @type {() => string}
     */
    this.greeting = greeting
  }

  /**
   * @param {string} who
   * @returns {Hello}
   */
  async hello({ who }) {
    const hello = new Hello({
      greeting: this.greeting(),
      who,
      number: ++number
    })
    await this.notifier.notifyFor(hello)
    return hello
  }
}

module.exports = {
  Greeter
}
