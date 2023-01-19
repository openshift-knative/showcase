class Hello {
  constructor({ greeting, who, number }) {

    /**
     * @type {string}
     */
    this.greeting = greeting

    /**
     * @type {string}
     */
    this.who = who

    /**
     * @type {number}
     */
    this.number = number
  }
}

module.exports = {
  Hello
}
