const fs = require('fs').promises

async function isDirectory(filepath) {
  try {
    const stat = await fs.lstat(filepath)
    return stat.isDirectory()
  } catch (ex) {
    if (ex.code === 'ENOENT') {
      return false
    }
    throw ex
  }
}

async function isFile(filepath) {
  try {
    const stat = await fs.lstat(filepath)
    return stat.isFile()
  } catch (ex) {
    if (ex.code === 'ENOENT') {
      return false
    }
    throw ex
  }
}

module.exports = {
  isDirectory,
  isFile,
}
