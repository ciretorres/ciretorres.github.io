<script setup>
import { useHeatmapStore } from '@/stores/heatmap'
// import muestras from '@/assets/datasets/consorcio_variantes_heatmap.json'

const HeatmapComponent = defineAsyncComponent(
  () => import('@/components/HeatmapComponent.vue')
)

const store = useHeatmapStore()

const muestras = ref(null)

async function fetchJSON() {
  try {
    // const respuesta = await fetch('/consorcio_variantes_heatmap_todas.json')
    // centroides - crateres
    const config = useRuntimeConfig()
    const respuesta = await fetch(
      `${config.app.baseURL}data/consorcio_variantes_heatmap.json`
    )
    // const respuesta = await fetch(`/data/centroides-crateres.json`)
    console.log('respuesta Cargada')
    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}`)
    }
    muestras.value = await respuesta.json()

    console.log('muestras Cargadas')
  } catch (error) {
    console.error('No se pudo cargar el JSON:', error)
  }
}

onMounted(async () => {
  // cargando datos
  await fetchJSON()
  // almacenando muestras en el store
  store.setMuestras(muestras.value)
})
</script>

<template>
  <div>
    <section
      class="pagina"
      style="display: flex; gap: 16px"
    >
      <div class="controles">
        <SelectorVariantes
          v-model="store.filtros.tipoVariante"
          :opciones="store.tiposVariantes"
        />

        <br />

        <button
          type="button"
          @click="store.limpiarFiltroTipo"
        >
          Mostrar todas
        </button>
      </div>

      <ClientOnly>
        <HeatmapComponent
          v-if="!store.cargando"
          :data="store.muestrasFiltradas"
          titulo="Distribución de muestras"
          file-name="distribucion-muestras"
        />
        <template #fallback>
          <div class="cargando-grafica">Cargando gráfico...</div>
        </template>
      </ClientOnly>
    </section>

    <section>
      <pre v-if="!store.cargando"><code>{{
        JSON.stringify(store.muestrasFiltradas, null, 2)
      }}</code></pre>
    </section>
  </div>
</template>

<style lang="scss">
.pagina {
  max-width: 1200px;
  // margin: 0 auto;
  // padding: 24px;
}

.controles {
  // display: flex;
  // align-items: start;
  // gap: 16px;
  margin: 24px 0;
}

button {
  padding: 8px 12px;
  border: 0;
  border-radius: 5px;
  background: #374151;
  color: white;
  cursor: pointer;
}
</style>
