const { isDirectory, isFile } = require('../../src/lib/fs')
const { expect, describe, it } = require('@jest/globals')

describe('fs', () => {
  describe('isDirectory', () => {
    it('should return true for a directory', async () => {
      expect(await isDirectory(__dirname)).toBeTruthy()
    })

    it('should return false for a file', async () => {
      expect(await isDirectory(__filename)).toBeFalsy()
    })
  })

  describe('isFile', () => {
    it('should return true for a file', async () => {
      expect(await isFile(__filename)).toBeTruthy()
    })

    it('should return false for a directory', async () => {
      expect(await isFile(__dirname)).toBeFalsy()
    })
  })
})
