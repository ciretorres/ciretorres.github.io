<script setup>
import * as d3 from 'd3'
import { useMultilineData } from '@/composables/useMultilineaData'

import { useConsorcioEvolucionVariantes } from '@/composables/useMultilineaComposable'
const { cargarDatos } = useConsorcioEvolucionVariantes()

const MultilineaComponent = defineAsyncComponent(
  () => import('@/components/MultilineaComponent.vue')
)

const consorcioEvolucionVariantes = ref(null)
const datosMultilinea = ref([])

const variables = [
  { id: 'VSIN', nombre: 'Variante bajo seguimiento', color: '#a6cee3' },
  { id: 'VIN', nombre: 'Variante de interés', color: '#b2df8a' },
  { id: 'VOM', nombre: 'Variante de monitoreo', color: '#fb9a99' },
  { id: 'VOC', nombre: 'Variante de preocupación', color: '#fdbf6f' },
  { id: 'VOI', nombre: 'Variante de interés', color: '#cab2d6' },
]

const conversionTemporal = d3.timeParse('%Y-%m-%d')

onMounted(async () => {
  consorcioEvolucionVariantes.value = await cargarDatos()

  // Convierte el JSON columnar en un arreglo de registros.
  const resultado = useMultilineData(consorcioEvolucionVariantes.value, {
    fechaMinima: '2021-01-01',
    fechaMaxima: '2021-06-30',
  })
  datosMultilinea.value = resultado.datosMultilinea.value
})
</script>

<template>
  <section class="multiline-diagram">
    <h3>Multiline</h3>

    <section aria-label="Componente de multilinea">
      <ClientOnly>
        <MultilineaComponent
          v-if="datosMultilinea"
          ref="lineasRef"
          :multilineas-id="'lineas'"
          :datos="datosMultilinea"
          :nombre-columna-horizontal="'fecha_recoleccion'"
          titulo-eje-x="Fecha de recolección"
          titulo-eje-y="Número"
          :variables="variables"
          :conversion-temporal="conversionTemporal"
          :alto-vis="400"
          :margin="{
            arriba: 20,
            abajo: 70,
            izquierda: 60,
            derecha: 30,
          }"
        />

        <template #fallback>
          <div class="cargando-grafica">Cargando gráfico...</div>
        </template>
      </ClientOnly>
    </section>

    <section aria-label="Base de datos">
      <pre v-if="datosMultilinea"><code>{{
        JSON.stringify(datosMultilinea, null, 2)
      }}</code></pre>
    </section>
  </section>
</template>
