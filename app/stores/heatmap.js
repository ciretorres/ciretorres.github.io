import { defineStore } from 'pinia'

export const useHeatmapStore = defineStore('heatmap', {
  state: () => ({
    muestras: [],

    filtros: {
      tipoVariante: 'VTODAS'
    },

    cargando: false
  }),

  getters: {
    tiposVariantes: state => {
      return [
        'VTODAS',
        ...new Set(
          state.muestras
            .map(item => item.tipo_variante)
            .filter(Boolean)
        )
      ]
    },

    muestrasFiltradas: state => {
      const filtro = state.filtros.tipoVariante

      if (!filtro || filtro === 'VTODAS') {
        return state.muestras
      }

      return state.muestras.filter(item => {
        return item.tipo_variante === filtro
      })
    },
  },

  actions: {
    setMuestras(muestras) {
      this.muestras = muestras
    },

    // async cargarMuestras() {
    //   this.cargando = true

    //   try {
    //     const datos = await $fetch('/api/muestras')

    //     this.muestras = datos
    //   } catch (error) {
    //     console.error('Error al cargar las muestras:', error)
    //     this.muestras = []
    //   } finally {
    //     this.cargando = false
    //   }
    // },

    limpiarFiltroTipo() {
      this.filtros.tipoVariante = 'VTODAS'
    }
  }
})


// import { defineStore } from 'pinia'
// import variantes from '@/assets/data/variantes.json'

// export const useHeatmapStore = defineStore('heatmap', {
//   state: () => ({
//     // variante_seleccionada: 'VTODAS', // VTODAS, VOC, VOI, VIN, VOM, VSIN
//     variante_seleccionada: variantes[0]?.clave ?? '',
//   }),

//   getters: {
//     varianteSeleccionada: state => state.variante_seleccionada,
//   },

//   actions: {
//     seleccionarVariante(value) {
//       // this.variante_seleccionada = value
//       const existe = variantes.some(
//         variante => variante.clave === value,
//       )

//       if (existe) {
//         this.variante_seleccionada = value
//       }
//     },
//   },
// })
