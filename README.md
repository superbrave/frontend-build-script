# Frontend Build Script

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This repository is intended as an opiniated approach to building assets and configuring linters. The linter settings therefor cannot be changed.

This repo is using Prettier to automatic format code to prevent the obvious style typos.

## 1. Installation

Use the following command to include the build script in your project.

```
yarn add https://github.com/superbrave/frontend-build-script
```

Or if you are using NPM:

```
npm i https://github.com/superbrave/frontend-build-script
```

## 2. Configuration

Copy the file `/webpack/example.webpack.settings.js` to `/webpack/webpack.settings.js`.
Additionally change `.env.example` to `.env` if you want settings for local development.

Make sure you copy the following files to your project's root folder:

```bash
cp /node_modules/superbrave/frontend-build-script/.eslintrc ./.eslintrc
cp /node_modules/superbrave/frontend-build-script/.stylelintrc.json ./.stylelintrc.json
cp /node_modules/superbrave/frontend-build-script/postcss.config.js ./postcss.config.js
```

Now you can change the variables as you desire.

## 3. Commands

Now you can run the following commands:

```bash
yarn hmr            # hot module replacement
yarn dev            # dev build
yarn prod           # prod build
yarn eslint         # run javascript linter
yarn stylelint      # run scss linter
```
