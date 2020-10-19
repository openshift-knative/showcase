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
    semi: ['off'],
    'no-console': ['off']
  },

  parserOptions: {
    sourceType: "module"
  }
};
