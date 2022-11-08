module.exports = {
  env: {
    es2021: true,
    node: true,
    commonjs: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'prettier', 'simple-import-sort', 'import'],
  rules: {
    'linebreak-style': ['error', 'unix'],
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'import/first': 'error',
    'import/newline-after-import': ['error', { count: 1 }],
    'import/no-duplicates': 'error',
  },
};
