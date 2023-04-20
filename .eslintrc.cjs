module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  rules: {
    'vue/multi-word-component-names': 'off',
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
};
