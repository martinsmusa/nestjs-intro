module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "quotes": ["error", "single"],
    "no-trailing-spaces": ["error", { "skipBlankLines": true }],
    "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 0 }],
    "object-curly-spacing": ["error", "always"],
    "template-curly-spacing": ["error", "always"],
    "semi": ["error", "always"],
    "no-multi-spaces": "error"
  },
};
