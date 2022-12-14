/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  overrides: [
    // Packages targeting DOM
    {
      files: ['packages/{vue,vue-compat,runtime-dom}/**'],
      rules: {
        'no-restricted-globals': ['error', NodeGlobals],
      },
    },
    // Node scripts
    {
      files: ['scripts/**', './*.js', 'packages/**/index.js', 'packages/size-check/**'],
      rules: {
        'no-restricted-globals': 'off',
        'no-restricted-syntax': 'off',
      },
    },
  ],
};
