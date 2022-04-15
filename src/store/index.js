import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    version_proyecto: process.env.PACKAGE_VERSION,
    actualizacion_proyecto: process.env.DATE_DEPLOY,
    entorno_proyecto: process.env.ENV_DEPLOY,
    // selectores de variables, seleccion inicial
    variante_seleccionada: 'VTODAS',
    estado_seleccionado: '00',
  },
  getters: {
    // version del proyecto
    versionProyecto(state) {
      return state.version_proyecto;
    },
    actualizacionProyecto(state) {
      return state.actualizacion_proyecto;
    },
    entornoProyecto(state) {
      return state.entorno_proyecto;
    },
    // selectores de variables
    varianteSeleccionada(state) {
      return state.variante_seleccionada;
    },
    estadoSeleccionado(state) {
      return state.estado_seleccionado;
    },
  },
  mutations: {
    // selectores de variables, nueva seleccion
    seleccionarVariante(state, value) {
      state.variante_seleccionada = value;
    },
    seleccionarEstado(state, value) {
      state.estado_seleccionado = value;
    },
  },
  actions: {
  },
  modules: {
  },
});
