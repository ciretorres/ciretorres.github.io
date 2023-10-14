<script setup>
import consorcioEvolucionVariantes from '@/assets/datasets/consorcio_evolucion_variantes.json'

import Multilinea from '@/components/visualizations/multilinea/MultilineaComponent.vue'

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

const datosGrafica = diccionarioNacional
const variablesGrafica = variables

// import { onMounted, ref } from 'vue'
// const public_path = process.env.BASE_URL
// onMounted(() => {
//   fetch(public_path + 'data/centroides-crateres.json')
//     .then(response => response.json())
//     .then(data => {
//       centroides.value = data
//     })
// })
// const data = async () => {
//   const response = await axios.get(
//     public_path + 'datasets/consorcio_variantes_heatmap_todas.json'
//   )
// }
import Multilinea2 from '@/components/visualizations/multilinea/MultilineaComponent2.vue'
import * as d3 from 'd3'
import data_edos from '../../../public/data/multilinea/data_edos.json'

const datos = data_edos
const conversionTemporal = d3.timeParse('%d-%m-%Y')
const edos_seleccionados = [
  {
    cve: '31',
    nombre: 'Yucatán',
    color: '#2c7fb8',
  },
]
</script>

<template>
  <div class="multiline-view">
    <div class="container sin-fondo">
      <Multilinea2
        ref="lineas1"
        :conversionTemporal="conversionTemporal"
        :datos="datos"
        :linea_id="'lineas1'"
        :margen="{ arriba: 10, abajo: 20, izquierda: 30, derecha: 30 }"
        :nombre_columna_horizontal="'fecha'"
        :titulo_eje_x="'Eje horizontal (temporal)'"
        :titulo_eje_y="'Eje vertical (numérico)'"
        :tooltip_activo="true"
        :variables="edos_seleccionados"
      />

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
