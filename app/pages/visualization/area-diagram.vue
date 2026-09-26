<script setup>
import * as d3 from 'd3'

import { useDatosApi } from '@/composables/usarDatosApi'
const { consultarDatos } = useDatosApi('data/area.json')

const AreaComponent = defineAsyncComponent(
  () => import('@/components/AreaComponent.vue')
)

const datosAreaOriginales = ref(null)
const datosArea = ref([])

// Parse data para Área
function parseAreaData() {
  // para fecha tipo "2021-01-01"
  const parseFecha = d3.timeParse('%Y-%m-%d')

  return datosAreaOriginales.value
    .map(data => ({
      ...data,
      date: parseFecha(data.date),
      value: Number(data.value),
    }))
    .filter(d => d.date instanceof Date && !Number.isNaN(d.value))
}

onMounted(async () => {
  // datosAreaOriginales.value = await fetchJSON()
  datosAreaOriginales.value = await consultarDatos()

  datosArea.value = parseAreaData()
})
</script>

<template>
  <section>
    <h3>Área</h3>

    <section>
      <ClientOnly>
        <AreaComponent
          v-if="datosArea"
          :datos="datosArea"
          :variables="[
            {
              id: 'value',
              nombre: 'Valor',
              color: '#4CAF50',
            },
          ]"
          titulo-eje-x="Fecha"
          titulo-eje-y="Valor"
        />

        <template #fallback>
          <div class="cargando-grafica">Cargando gráfico...</div>
        </template>
      </ClientOnly>
    </section>

    <section aria-label="Base de datos">
      <pre v-if="datosArea"><code>{{
        JSON.stringify(datosArea, null, 2)
      }}</code></pre>
    </section>
  </section>
</template>
