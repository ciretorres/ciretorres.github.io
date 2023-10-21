<script setup>
import axios from 'axios';
import * as d3 from 'd3';
import { computed, onMounted, ref } from 'vue';

import Area from '@/components/visualizations/area/AreaComponent.vue';

// const public_path = process.env.BASE_URL
const public_path = import.meta.env.BASE_URL

const data = ref([])
const errored = ref(false)
const loading = ref(true)

onMounted(() => {
  // api request
  axios
    .get(public_path + 'data/area/area.json')
    .then(response => {
      // handle data array here
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

const datosArea = computed(() => {
  data.value.forEach(d => {
    // Parse data
    d.date = d3.timeParse('%Y-%m-%d')(d.date)
    d.value = +d.value
  })
  return data.value
})
// console.log(datosArea)
</script>

<template>
  <div class="area-view">
    <div class="container sin-fondo">
      <h1>Area</h1>
      <Area
        :area_id="'area'"
        :datos="datosArea"
      />
    </div>
  </div>
</template>
