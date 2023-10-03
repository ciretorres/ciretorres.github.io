<script setup>
import * as d3 from 'd3'

// import dataJSON from '@/assets/data/area/data.json'

import Area from '@/components/visualizations/area/AreaComponent.vue'

import { onMounted, ref, computed } from 'vue'
import axios from 'axios'

const public_path = process.env.BASE_URL

const data = ref([])
const errored = ref(false)
const loading = ref(true)

onMounted(() => {
  axios
    .get(public_path + 'data/area/data.json')
    .then(response => {
      data.value = response.data
      // console.log('data.value', data.value)
    })
    .catch(error => {
      console.log(error)
      errored.value = true
    })
    .finally(() => {
      loading.value = true
    })
})

// const datosArea = computed(() => {
//   dataJSON.forEach(d => {
//     // Parse data
//     d.date = d3.timeParse('%Y-%m-%d')(d.date)
//     d.value = +d.value
//   })
//   return dataJSON
// })
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
  <div class="area-view">
    <div class="container sin-fondo">
      <Area
        :area_id="'area'"
        :datos="datosArea"
        :titulo_proyecto="'Título/enlace del proyecto'"
        fecha_actualizacion="dd/mm/aaaa"
        titulo_eje_x="Título eje x"
        titulo_eje_y="Título eje y"
        titulo_leyenda="Título de leyenda"
        color_area="#fff"
      />
    </div>
  </div>
</template>
