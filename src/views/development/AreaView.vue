<script setup>
import * as d3 from 'd3'

import dataJSON from '@/assets/data/area/data.json'

import Area from '@/components/visualizations/area/AreaComponent.vue'
import Area4 from '@/components/visualizations/area/AreaComponent4.vue'

import { onMounted, ref, computed } from 'vue'
import axios from 'axios'

const public_path = process.env.BASE_URL

const data = ref([])
const errored = ref(false)
const loading = ref(true)

onMounted(() => {
  axios
    .get(public_path + 'data/area/area.json')
    .then(response => {
      data.value = response.data
    })
    .catch(error => {
      console.log(error)
      errored.value = true
    })
    .finally(() => {
      loading.value = true
    })
})

const datosArea0 = computed(() => {
  dataJSON.forEach(d => {
    // Parse data
    d.date = d3.timeParse('%Y-%m-%d')(d.date)
    d.value = +d.value
  })
  return dataJSON
})
const datosArea = computed(() => {
  data.value.forEach(d => {
    // Parse data
    d.date = d3.timeParse('%Y-%m-%d')(d.date)
    d.value = +d.value
  })
  return data.value
})

import Area2 from '@/components/visualizations/area/AreaComponent2.vue'
import Variables from '../../../public/data/area/dummy_voc.json'

let dict_meses = {
  ene: '01',
  feb: '02',
  mar: '03',
  abr: '04',
  may: '05',
  jun: '06',
  jul: '07',
  ago: '08',
  sep: '09',
  oct: '10',
  nov: '11',
  dic: '12',
}
let dict_meses_invert = {}
Object.keys(dict_meses).map(d => (dict_meses_invert[dict_meses[d]] = d))

Variables.map(d => {
  if (d.fecha_1.includes('/')) {
    let fecha_sep = d.fecha_1.split('/')
    d.fecha_1 = [fecha_sep[0], dict_meses[fecha_sep[1]], fecha_sep[2]].join('-')
    fecha_sep = d.fecha_2.split('/')
    d.fecha_2 = [fecha_sep[0], dict_meses[fecha_sep[1]], fecha_sep[2]].join('-')
  }
})

const datos_grafica = ref([])
datos_grafica.value = [...Variables]
</script>

<template>
  <div class="area-view">
    <div class="container sin-fondo">
      <Area4
        :area_id="'area'"
        :datos="datosArea"
      />
      <Area2
        v-if="false"
        areas_apiladas_id="streamgraphbasico"
        :alto_vis="300"
        :datos="datos_grafica"
        :tooltip_activo="true"
        :variables="[
          { id: 'Variable_1', nombre: 'Variable_1', color: '#C2E7D9' },
        ]"
        nombre_columna_horizontal="fecha_1"
      />
      <Area
        :area_id="'area_0'"
        :datos="datosArea0"
        color_area="#fff"
      />
    </div>
  </div>
</template>
