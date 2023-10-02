<script setup>
import consorcioEvolucionVariantes from '@/assets/datasets/consorcio_evolucion_variantes.json'

import Multilinea from '@/components/visualizations/multilinea/MultilineaComponent.vue'

// import axios from 'axios'

// import { onMounted, ref } from 'vue'

// import usarDatosApi from '../../components/utils/usarDatosApi'
// import { fetchJSON } from '../../components/utils/utiles'

const diccionarioNacional = consorcioEvolucionVariantes

const dictValuesRango = {
  Rango_0: '0',
  Rango_1: '0 a 19',
  Rango_2: '20 a 39',
  Rango_3: '40 a 59',
  Rango_4: '60 a 79',
  Rango_5: '80 o más',
}

const dictColorsRango = {
  Rango_0: '#efefef',
  Rango_1: '#d9d9d9',
  Rango_2: '#cccccc',
  Rango_3: '#b7b7b7',
  Rango_4: '#999999',
  Rango_5: '#666666',
}

const variables = Object.entries(dictValuesRango).map(rango => {
  return {
    color: dictColorsRango[rango[0]],
    nombre: rango[1],
    id: rango[0],
  }
})

// const public_path = process.env.BASE_URL
// const data = ref([])

// const { datos } = usarDatosApi('/consorcio_evolucion_variantes.json')

// const insformacion = ref([])

// onMounted(() => {
//   // fetchJSON(
//   //   public_path + 'datasets/consorcio_variantes_heatmap_todas.json',
//   //   []
//   // ).then(data => {
//   //   insformacion.value = data
//   // })
//   // fetch(public_path + 'datasets/consorcio_variantes_heatmap_todas.json')
//   //   .then(response => response.json())
//   //   .then(data => {
//   //     insformacion.value = data
//   //   })
//   // axios
//   //   .get(public_path + 'datasets/consorcio_evolucion_variantes.json')
//   //   .then(response => {
//   //     console.log('response', response.data)
//   //     data.value = response.data
//   //     // console.log('data.value', Object.entries(data.value[0]))
//   //   })
// })

// axios
//   .get(public_path + 'datasets/consorcio_evolucion_variantes.json')
//   .then(response => {
//     data.value = response.data
//   })

const datosGrafica = diccionarioNacional
const variablesGrafica = variables
</script>

<template>
  <div class="multiline-view">
    <div class="container sin-fondo">
      <Multilinea
        titulo="Evolución de variables"
        fecha_actualizacion="dd/mm/aa"
        :datos="datosGrafica"
        :nombre_variables="{ nombre: 'nombre' }"
        :variables="variablesGrafica"
        :alto_vis="400"
        titulo_leyenda="leyenda"
      />
    </div>
  </div>
</template>
