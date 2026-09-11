<script setup>
import * as d3 from 'd3'
import { ref } from 'vue'

import datosA from '@/assets/data/area.json'

const data = ref(datosA)

// Parse data para Área
const datosArea = computed(() => {
  data.value.forEach((d) => {
    d.date = d3.timeParse('%Y-%m-%d')(d.date)
    d.value = +d.value
  })
  return data.value
})
// console.log(datosArea.value)
</script>

<template>
  <article class="">
    <h3>Area</h3>
    <ClientOnly>
      <AreaComponent :datos="datosArea" />
    </ClientOnly>
  </article>
</template>
