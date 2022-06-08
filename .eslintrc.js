module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-await-in-loop': 'off',
    'no-promise-executor-return': 'off',
    'no-shadow': 'off',
    'no-loop-func': 'off',
  },
};
