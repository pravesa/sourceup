// Root eslint config file
/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  // Stops eslint from looking for config files in parent directory
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['sourceup/react-app', 'sourceup'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
  },
};
