# eslint-config-sourceup

This package provides sourceup's .eslintrc as an extensible shared config.

## Installation

Install the package by npm or yarn as listed below:

```sh
npm install --save-dev eslint-config-sourceup
```

or

```sh
yarn add -dev eslint-config-sourceup
```

## Usage

This Package lists eslint and prettier as its peer dependencies, so install those before start using this package.

We export two ESLint configurations for your usage.

### eslint-config-sourceup

This entry point enables the base linting rules (including prettier) with support for import and @typescript-eslint (only ts and tsx files are linted) plugins. To use, add `"extends": ["sourceup"]` to your `.eslintrc`.

### eslint-config-sourceup/react-app

This entry point enables the linting rules for react apps by extending react, react-hooks and jsx-a11y plugins (only jsx and tsx files are linted). To use, add `"extends": ["sourceup/react-app"]` to your `.eslintrc`.

### For react + typescript project

add `"extends": ["sourceup/react-app", "sourceup"]` to your `.eslintrc`.
