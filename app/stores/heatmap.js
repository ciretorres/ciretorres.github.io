import { defineStore } from 'pinia'

export const useHeatmapStore = defineStore('heatmap', {
  state: () => ({
    variante_seleccionada: 'VTODAS', // VTODAS, VOC, VOI, VIN, VOM, VSIN
  }),

  getters: {
    varianteSeleccionada: state => state.variante_seleccionada,
  },

  actions: {
    seleccionarVariante(value) {
      this.variante_seleccionada = value
    },
  },
})
