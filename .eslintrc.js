module.exports = {
  extends: 'piecioshka',

  // http://eslint.org/docs/user-guide/configuring#specifying-environments
  env: {
    es6: true,
    browser: false,
    node: true,
    commonjs: true,
    amd: false,
    'jest/globals': true
  },

  plugins: ['jest'],

  rules: {
    semi: ['error', 'never'],
    indent: ["error", 2],
    'no-console': ['off'],
    'global-require': ['off'],
    'require-jsdoc': ['off'],
    'no-magic-numbers': ['off'],
    'func-style': ['off'],
  },

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  }
};
