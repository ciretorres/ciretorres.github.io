import { defineStore } from 'pinia'

export const useStore = defineStore('storeId', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      variante_seleccionada: 'VTODAS' // VTODAS, VOC, VOI, VIN, VOM, VSIN
    }
  },
  getters: {
    varianteSeleccionada() {
      return this.variante_seleccionada
    }
  },
  actions: {
    seleccionarVariante(value) {
      this.variante_seleccionada = value
    }
  }
})
