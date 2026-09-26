<script setup>
import { useDatosApi } from '@/composables/usarDatosApi'
import { useHeatmapStore } from '@/stores/heatmap'

const { consultarDatos } = useDatosApi('data/consorcio_variantes_heatmap.json')

const store = useHeatmapStore()

const HeatmapComponent = defineAsyncComponent(
  () => import('@/components/HeatmapComponent.vue')
)

const muestras = ref(null)

onMounted(async () => {
  // cargando datos
  muestras.value = await consultarDatos()
  // almacenando muestras en el store
  store.setMuestras(muestras.value)
})
</script>

<template>
  <section>
    <section
      class="Componente mapa de calor"
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

    <section aria-label="Base de datos">
      <pre v-if="!store.cargando"><code>{{
        JSON.stringify(store.muestrasFiltradas, null, 2)
      }}</code></pre>
    </section>
  </section>
</template>

<style lang="scss">
.pagina {
  max-width: 1200px;
}

.controles {
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
