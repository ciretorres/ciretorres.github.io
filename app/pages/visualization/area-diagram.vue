<script setup>
import * as d3 from 'd3'
import { computed } from 'vue'

import datosAreaOriginales from '@/assets/data/area.json'

// Parse data para Área
const datosArea = computed(() => {
  // para fecha tipo "2021-01-01"
  const parseFecha = d3.timeParse('%Y-%m-%d')

  return datosAreaOriginales
    .map(data => ({
      ...data,
      date: parseFecha(data.date),
      value: Number(data.value)
    }))
    .filter(d => d.date instanceof Date && !Number.isNaN(d.value))
})
</script>

<template>
  <article>
    <h3>Área</h3>

    <ClientOnly>
      <AreaComponent
        :datos="datosArea"
        :variables="[
          {
            id: 'value',
            nombre: 'Valor',
            color: '#4CAF50'
          }
        ]"
        titulo-eje-x="Fecha"
        titulo-eje-y="Valor"
      />
    </ClientOnly>
  </article>
</template>
