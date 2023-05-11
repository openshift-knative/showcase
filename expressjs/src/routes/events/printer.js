/**
 * @typedef {import('cloudevents').CloudEvent} CloudEvent
 */

class Printer {

  /**
   * Prints a CloudEvent in human-readable format.
   *
   * @param {CloudEvent} ce - the CloudEvent to receive
   * @returns {string} - the human-readable representation of the CloudEvent
   */
  print(ce) {
    let valid = 'valid'
    try {
      ce.validate()
    } catch (err) {
      valid = 'invalid'
    }
    let buf = '☁️  cloudevents.Event\n'
    buf += `Validation: ${valid}\n`
    const attr = attribites(ce)
    buf += printAttr(attr)
    buf += printExts(ce, attr)
    buf += printData(ce)
    return buf
  }

}

/**
 * @param {CloudEvent} ce - the CloudEvent
 * @returns {Object} - the CloudEvent attributes
 * @private
 */
function attribites(ce) {
  const attr = {
    specversion: ce.specversion,
    type: ce.type,
    source: ce.source,
    id: ce.id,
  }
  if (ce.subject) {
    attr.subject = ce.subject
  }
  if (ce.time) {
    attr.time = ce.time
  }
  if (ce.datacontentencoding) {
    attr.datacontentencoding = ce.datacontentencoding
  }
  if (ce.dataschema) {
    attr.dataschema = ce.dataschema
  }
  if (ce.datacontenttype) {
    attr.datacontenttype = ce.datacontenttype
  }
  return attr
}

/**
 * @param {Object} attr - the CloudEvent attributes
 * @returns {string} - the buffer
 */
function printAttr(attr) {
  let buf = 'Context Attributes,\n'
  for (const [k, v] of Object.entries(attr)) {
    buf += `  ${k}: ${v}\n`
  }
  return buf
}

/**
 * @param {CloudEvent} ce - the CloudEvent
 * @param {Object} attr - the CloudEvent attributes
 * @returns {Object} - the CloudEvent extensions
 * @private
 */
function extensions(ce, attr) {
  const excludes = Object.keys(attr)
  excludes.push('data')
  excludes.push('data_base64')
  const exts = {}

  for (const [k, v] of Object.entries(ce)) {
    if (!excludes.includes(k) && v) {
      exts[k] = v
    }
  }
  return exts
}

/**
 * @param {CloudEvent} ce - the CloudEvent
 * @param {Object} attr - the CloudEvent attributes
 * @returns {string} - the buffer
 */
function printExts(ce, attr) {
  let buf = ''
  const exts = extensions(ce, attr)
  if (Object.keys(exts).length > 0) {
    buf += `Extensions,\n`
    for (const [k, v] of Object.entries(exts)) {
      buf += `  ${k}: ${v}\n`
    }
  }
  return buf
}

/**
 * @param {CloudEvent} ce - the CloudEvent
 * @returns {string} - the buffer
 * @private
 */
function printData(ce) {
  let buf = ''
  if (ce.data) {
    buf += `Data,\n`
    if (ce.datacontenttype === 'application/json') {
      const data = indent(JSON.stringify(ce.data, ' ', 2), 1, 2)
      buf += `${data}\n`
      return buf
    }
    const repr = ce.data.toString()
    return `${buf}${indent(repr, 1, 2)}\n`
  }
  return buf
}

/**
 * Indents the given string
 * @param {string} str  The string to be indented.
 * @param {number} numOfIndents  The amount of indentations to place at the
 *     beginning of each line of the string.
 * @param {number=} spacesPerIndent  Optional.  If specified, this should be
 *     the number of spaces to be used for each tab that would ordinarily be
 *     used to indent the text.  These amount of spaces will also be used to
 *     replace any tab characters that already exist within the string.
 * @return {string}  The new string with each line beginning with the desired
 *     amount of indentation.
 */
function indent(str, numOfIndents, spacesPerIndent) {
  const txt = str.replace(/^(?=.)/gm, new Array(numOfIndents + 1).join('\t'))
  const num = new Array(spacesPerIndent + 1 || 0).join(' ') // re-use
  return spacesPerIndent
    ? txt.replace(/^\t+/gm, tabs => {
      return tabs.replace(/./g, num)
    })
    : txt
}

module.exports = Printer
