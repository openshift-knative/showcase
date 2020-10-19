module.exports = {
  extends: 'piecioshka',

  // http://eslint.org/docs/user-guide/configuring#specifying-environments
  env: {
    es6: true,
    browser: false,
    node: true,
    commonjs: true,
    amd: false
  },

  rules: {
    semi: ['error', 'never'],
    'no-console': ['off'],
    'global-require': ['off'],
  },

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  }
};
