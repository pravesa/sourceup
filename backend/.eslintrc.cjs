// Root eslint config file
/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  // Stops eslint from looking for config files in parent directory
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: ['sourceup'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
};
