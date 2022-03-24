# README

## Project setup

Versión de nodeJS recomendada v14.17.5

1. Clonar repositorio
```
git clone https://github.com/ciretorres/ciretorres.github.io.git
```
2. Ingresar al folder

```
cd ciretorres.github.io
```
3. Cambiar de rama a develop

```
git checkout develop
```
4. Instalar dependencias

```
npm install
```
5. Hacer una nueva rama (feature-, bugfix-, ...)

```
git checkout -b feature-nombre-rama
```
6. Subir cambios a rama

```
git push origin <feature-nombre-rama>
```
7. Mergear rama con develop

```
git merge <feature-nombre-rama>
```
8. Compilar para producción

```
npm run build
```
9. Subir cambios a subrama gh-pages

```
git subtree push dist origin gh-pages
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
