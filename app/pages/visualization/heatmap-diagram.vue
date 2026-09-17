<script setup>
import { useHeatmapStore } from '@/stores/heatmap'
import muestras from '@/assets/datasets/consorcio_variantes_heatmap.json'

const store = useHeatmapStore()

store.setMuestras(muestras)
</script>

<template>
  <section class="pagina" style="display: flex; gap: 16px;">

    <div class="controles">
      <SelectorVariantes
        v-model="store.filtros.tipoVariante"
        :opciones="store.tiposVariantes"
      />

      <br >

      <button
        type="button"
        @click="store.limpiarFiltroTipo"
      >
        Mostrar todas
      </button>
    </div>

    <ClientOnly>
      <p v-if="store.cargando">
        Cargando datos...
      </p>
      <HeatmapComponent
        v-else
        :data="store.muestrasFiltradas"
      />
    </ClientOnly>
  </section>
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
