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
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.js'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'react/function-component-definition': ['error', {
      namedComponents: 'function-declaration',
      unnamedComponents: 'arrow-function',
    }],
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-wrap-multilines': ['error', {
      declaration: 'parens',
      assignment: 'parens',
      return: 'parens',
      arrow: 'parens',
      condition: 'parens',
      logical: 'parens',
      prop: 'parens',
    }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
      },
    ],
    'import/prefer-default-export': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-underscore-dangle': ['error', { allow: ['_s'] }],
    'no-trailing-spaces': 'error',
    'arrow-parens': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'class-methods-use-this': 'off',
    'object-curly-newline': ['error', {
      multiline: true,
      consistent: true,
    }],
    'no-plusplus': 'off',
    'no-else-return': 'error',
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'max-len': ['error', {
      code: 120,
      ignoreComments: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'one-var': 'off',
    'one-var-declaration-per-line': 'off',
    'no-nested-ternary': 'warn',
    'no-promise-executor-return': 'off',
    'eol-last': ['error', 'always'],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
};
