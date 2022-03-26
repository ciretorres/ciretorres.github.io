<template>
  <div id="app">
    <Inicio msg="En mantenimiento..."/>
  </div>
</template>

<script>
import Inicio from './components/Inicio.vue'

export default {
  name: 'App',
  components: {
    Inicio
  }
}
</script>

<style lang="scss">
@import '@/scss/app.scss';
#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  text-align: left;
  // color: #2c3e50;
  margin-top: 60px;
}
</style>
