module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-undef': 'error',
    'no-unused-vars': ['error', { args: 'none' }],
    '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
    'import/prefer-default-export': 'off',
    'newline-per-chained-call': 'off',
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
};
