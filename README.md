# Frontend Build Script

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This repository is intended as an opiniated approach to building assets and configuring linters. The linter settings therefor cannot be changed.

This repo is using Prettier to automatic format code to prevent the obvious style typos.

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

Copy the file `./node_modules/superbrave-build-script/example.webpack.settings.js` to `./webpack.settings.js`.
Additionally change `.env.example` to `.env` if you want settings for local development.

Make sure you copy the following files to your project's root folder:

```bash
cp ./node_modules/superbrave-build-script/.eslintrc ./.eslintrc
cp ./node_modules/superbrave-build-script/.stylelintrc.json ./.stylelintrc.json
```

Now you can change the variables as you desire.

## 3. Commands

Now you can copy the following commands to your package.json:

```bash
"hmr": "webpack-dev-server --config ./node_modules/superbrave-build-script/config.development.js",
"prod": "webpack --config ./node_modules/superbrave-build-script/config.production.js --progress --hide-modules",
"eslint": "eslint src/js/index.js",
"stylelint": "stylelint src/scss/style.scss"
```
