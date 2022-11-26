// React-app eslint configs
/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  overrides: [
    {
      files: ['**/*.{jsx,tsx}'],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
      ],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ['react', 'react-hooks', 'jsx-a11y'],
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
        'react-hooks/exhaustive-deps': 'warn',
        'react/jsx-curly-brace-presence': 'warn',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
