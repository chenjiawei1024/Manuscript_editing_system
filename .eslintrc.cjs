module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  // parser: 'vue-eslint-parser',
  extends: [
    // '@typescript-eslint/parser',
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  // overrides: [
  //   // Node scripts
  //   {
  //     files: ['scripts/**'],
  //     rules: {
  //       'no-restricted-globals': 'off',
  //       'no-restricted-syntax': 'off',
  //     },
  //   },
  // ],
};
