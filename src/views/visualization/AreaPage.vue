<script setup>
// TODO: importar solo timeParse de d3
import * as d3 from 'd3'
import { computed, onMounted, ref } from 'vue'

import datosA from '@/assets/data/area/area.json'
import Area from '@/components/visualizations/area/AreaComponent.vue'

const data = ref(datosA)

onMounted(() => {
  // TODO: hacerlo con fetch api request
  // fetch(public_path + 'data/centroides-crateres.json')
  //   .then(response => {
  //     // Verificar el estado de la respuesta
  //     if (!response.ok) {
  //       throw new Error('La solicitud no pudo realizarse con éxito')
  //     }
  //     // Analizar la respuesta como JSON
  //     return response.json()
  //   })
  //   .then(data => {
  //     centroides.value = data
  //   })
  //   .catch(error => {
  //     // Manejar errores de la solicitud
  //     console.warn('Error en la solicitud de los datos remotodo')
  //   })
  //---------
  // axios
  //   .get(datosA)
  //   .then((response) => {
  //     // handle data array here
  //     data.value = response.data
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //     errored.value = true
  //   })
  //   .finally(() => {
  //     loading.value = true
  //   })
})

const datosArea = computed(() => {
  data.value.forEach(d => {
    // Parse data
    d.date = d3.timeParse('%Y-%m-%d')(d.date)
    d.value = +d.value
  })
  return data.value
})
</script>

<template>
  <article class="">
    <h3>Area</h3>
    <Area :datos="datosArea" />
  </article>
</template>
