/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  verbose: true,
  projects: [{
    displayName: 'test',
    testEnvironment: 'node',
  }, {
    displayName: 'lint',
    runner: 'jest-runner-eslint',
    testMatch: [
      '<rootDir>/src/**/*.js',
      '<rootDir>/test/**/*.js',
      '<rootDir>/scripts/**/*.ts',
    ],
  }]
}
