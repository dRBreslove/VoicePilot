module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
  ],
  parser: 'espree',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx', '.js'] }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': ['error', { allow: ['_s'] }],
    'no-trailing-spaces': 'error',
    'arrow-parens': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-console': 'warn',
    'react/function-component-definition': ['error', {
      namedComponents: 'function-declaration',
      unnamedComponents: 'arrow-function',
    }],
    'react/jsx-one-expression-per-line': 'off',
    'object-curly-newline': ['error', {
      multiline: true,
      consistent: true,
    }],
    'no-plusplus': 'off',
    'no-else-return': 'error',
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'max-len': ['error', { code: 120 }],
    'one-var': 'off',
    'one-var-declaration-per-line': 'off',
    'no-nested-ternary': 'warn',
    'react/jsx-wrap-multilines': ['error', {
      declaration: 'parens',
      assignment: 'parens',
      return: 'parens',
      arrow: 'parens',
      condition: 'parens',
      logical: 'parens',
      prop: 'parens',
    }],
    'eol-last': ['error', 'always'],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'airbnb-typescript',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
      },
    },
  ],
};
