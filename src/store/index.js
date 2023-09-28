import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // selectores de variables, seleccion inicial
    variante_seleccionada: 'VTODAS',
    estado_seleccionado: '00',
  },
  getters: {
    // selectores de variables
    varianteSeleccionada(state) {
      return state.variante_seleccionada
    },
    estadoSeleccionado(state) {
      return state.estado_seleccionado
    },
  },
  mutations: {
    // selectores de variables, nueva seleccion
    seleccionarVariante(state, value) {
      state.variante_seleccionada = value
    },
    seleccionarEstado(state, value) {
      state.estado_seleccionado = value
    },
  },
  actions: {},
  modules: {},
})
