<script setup>
import * as d3 from 'd3'

// import datosAreaOriginales from '@/assets/data/area.json'

const AreaComponent = defineAsyncComponent(
  () => import('@/components/AreaComponent.vue')
)

const datosAreaOriginales = ref(null)
const datosArea = ref([])

async function fetchJSON() {
  const datos = ref(null)

  try {
    // const respuesta = await fetch('/consorcio_variantes_heatmap_todas.json')
    // centroides - crateres
    const config = useRuntimeConfig()
    const respuesta = await fetch(`${config.app.baseURL}data/area.json`)
    // const respuesta = await fetch(`/data/centroides-crateres.json`)
    console.log('respuesta Cargada')
    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}`)
    }
    datos.value = await respuesta.json()
    console.log('areas Cargadas')
    return datos.value
  } catch (error) {
    console.error('No se pudo cargar el JSON:', error)
    return null
  }
}

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
  datosAreaOriginales.value = await fetchJSON()
  datosArea.value = parseAreaData()
})
</script>

<template>
  <article>
    <h3>Área</h3>

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

    <section>
      <pre v-if="datosArea"><code>{{
        JSON.stringify(datosArea, null, 2)
      }}</code></pre>
    </section>
  </article>
</template>
