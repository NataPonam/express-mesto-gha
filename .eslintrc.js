module.exports = {
  env: {
    browser: true,
    es2021: true,
    commonjs: true,
  },
  extends: 'airbnb-base',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',

  },
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'no-console': 'off',
  },
};
