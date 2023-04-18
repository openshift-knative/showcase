/* global WebAssembly */

const { WASI, init } = require('@wasmer/wasi')
const { HTTP } = require('cloudevents')
const fs = require('fs').promises
const path = require('path')

class PrinterFactory {

  /**
   * Creates a new Printer instance.
   *
   * @returns {Promise<Printer>} - the new Printer instance
   */
  async create() {
    // Initialize WASI
    await init()
    const wasi = new WASI({
      args: ['cloudevents-pretty-print.wasm'],
      env: {},
    })
    const wasm = path.join(__dirname, '../../../build/wasm/cloudevents-pretty-print.wasm')
    const buf = new Uint8Array(await fs.readFile(wasm))
    const module = await WebAssembly.compile(buf)

    // Instantiate the WASI module
    const instance = await wasi.instantiate(module, {})

    return new Printer({ instance })
  }
}

class Printer {

  /**
   * Creates a new Printer instance.
   *
   * @param {Object} v - the params object
   * @param {WebAssembly.Instance} v.instance - the WebAssembly instance
   */
  constructor({ instance }) {
    this.mem = instance.exports.memory
    this.fn = instance.exports.pp_print
  }

  /**
   * Prints a CloudEvent into a human readable text.
   *
   * @param {CloudEvent} ce - the CloudEvent to print
   * @returns {string} - the human readable text
   */
  print(ce) {
    const message = HTTP.structured(ce).body

    writeToMemory(message, this.mem)

    const rc = this.fn(0)
    if (rc !== 0) {
      throw new Error(`pp_print() returned ${rc}`)
    }

    return readFromMemory(this.mem)
  }
}

/**
 * Writes a string into the shared memory as a CString.
 *
 * @param {string} message - the string to write
 * @param {WebAssembly.Memory} mem - the shared memory
 */
function writeToMemory(message, mem) {
  const enc = new TextEncoder()
  const view = new Uint8Array(mem.buffer)
  const state = enc.encodeInto(message, view)
  view[state.written] = 0
}

/**
 * Reads a CString from the shared memory.
 *
 * @param {WebAssembly.Memory} mem - the shared memory
 * @returns {string} - the string read from the shared memory
 */
function readFromMemory(mem) {
  const view = new Uint8Array(mem.buffer)
  let messageBytes = []
  for (let i = 0; i < view.length; i++) {
    if (view[i] === 0) {
      break
    }
    messageBytes.push(view[i])
  }
  const dec = new TextDecoder('utf-8')
  const res = dec.decode(new Uint8Array(messageBytes))
  return res
}

module.exports = {
  Printer,
  PrinterFactory
}
