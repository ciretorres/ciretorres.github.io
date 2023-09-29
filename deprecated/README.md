# README

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

* [Node.js](https://nodejs.org/es) versión 16 o superior
* [Npm](https://docs.npmjs.com/getting-started) versión 8 o superior
* [Vue.js 3.3.4](https://vuejs.org/)
* [@vue/cli 5.0.8](https://cli.vuejs.org/guide/installation.html)

## Project Setup

```sh
# Clonar repositorio [Guía](https://docs.github.com/es/repositories/creating-and-managing-repositories/cloning-a-repository)
$ git clone https://github.com/ciretorres/ciretorres.github.io.git

# Instalar las dependencias
$ npm install

# Levantar el proyecto
$ npm run dev

# Compilar y minificar el código
$ npm run build

# Subir cambios a subrama gh-pages
$ git subtree push --prefix dist origin gh-pages

# Run Unit Tests with [Vitest](https://vitest.dev/)
$ npm run test:unit

# Run End-to-End Tests with [Cypress](https://www.cypress.io/)
$ npm run test:e2e:dev

# This runs the end-to-end tests against the Vite development server.
# It is much faster than the production build.

# But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

$ npm run build
$ npm run test:e2e

# Lint with [ESLint](https://eslint.org/)
$ npm run lint
```

See [Fontastic.me](https://app.fontastic.me)