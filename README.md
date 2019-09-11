# Frontend Build Script

This repository is intended as an opiniated approach to building assets and configuring linters. The linter settings therefor cannot be changed.

This repo is using Prettier to automatic format code to prevent the obvious style typos.

Prettier is integrated within the `stylelint` and `eslint` configuration files. If you like to disable prettier just remove these lines in your own config.

## 1. Installation

Use the following command to include the build script in your project.

```
yarn add superbrave-build-script
```

Or if you are using NPM:

```
npm i superbrave-build-script
```

## 2. Configuration

Make sure you copy the following files to your project's root folder:

```bash
cp ./node_modules/superbrave-build-script/example.webpack.settings.js ./webpack.settings.js
cp ./node_modules/superbrave-build-script/.eslintrc ./.eslintrc
cp ./node_modules/superbrave-build-script/.stylelintrc.json ./.stylelintrc.json
cp ./node_modules/superbrave-build-script/.prettierrc ./.prettierrc
```

Additionally change `.env.example` to `.env` if you want settings for local development.

Now you can change the variables as you desire.

## 3. Commands

Now you can copy the following commands to your package.json:

```bash
"hmr": "webpack-dev-server --config ./node_modules/superbrave-build-script/config.development.js",
"prod": "webpack --config ./node_modules/superbrave-build-script/config.production.js --progress --hide-modules",
"eslint": "eslint src/js/index.js",
"stylelint": "stylelint src/scss/style.scss"
```
