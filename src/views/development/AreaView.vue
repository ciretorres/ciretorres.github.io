<script setup>
import { onMounted, ref, computed } from 'vue'
import axios from 'axios'
import * as d3 from 'd3'

import Area from '@/components/visualizations/area/AreaComponent.vue'

const public_path = process.env.BASE_URL

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
</script>

<template>
  <div class="area-view">
    <div class="container sin-fondo">
      <Area
        :area_id="'area'"
        :datos="datosArea"
      />
    </div>
  </div>
</template>
