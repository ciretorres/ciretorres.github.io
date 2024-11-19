<script setup>
// TODO:
// - revisar el código comentado abajo,
// - revisar el controlador y selectores de variantes y estados
import Heatmap from '@/components/visualizations/heatmap/HeatmapComponent.vue'
import SelectorVariantes from '@/components/visualizations/heatmap/SelectorVariantes.vue'

import usarDatosApi from '@/components/utils/usarDatosApi'

const end_point = '/consorcio_variantes_heatmap_todas.json'

const { datos } = usarDatosApi(end_point)
</script>

<template>
  <div class="mapa-de-calor">
    <div class="selectores-fijos">
      <div class="contenedor">
        <SelectorVariantes class="selector" />
      </div>
    </div>

    <Heatmap :datos="datos" />
  </div>
</template>

<style lang="scss">
.selectores-fijos {
  .contenedor {
    .selector {
      display: inline-block;

      &:first-child {
        margin-right: 20px;
      }

      label {
        display: block;
        font-size: 14px;
        font-weight: 400;
        line-height: 1em;
        margin: 10px 0;
      }
      select {
        display: block;
        font-size: 14px;
        font-weight: 600;
        padding: 7px 30px 7px 10px;
        border-radius: 5px;
        width: 100%;
        margin-bottom: 10px;
      }
    }
  }
}
</style>

<!-- <template>
  <div class="mapa-de-calor">    
    <h1>Mapa de calor</h1>
    <div class="selectores-fijos">
      <div class="contenedor">
        <SelectorVariantes class="selector" />
        <SelectorEstados class="selector" />
      </div>
      <div class="container display-none">
        <SelectorVariantes class="selector" />
        <SelectorEstados class="selector" />
      </div>
      <div class="container display-flex">
        <div class="selectores">
          <SelectorVariantes class="selector" />
          <SelectorEstados class="selector" />
        </div>
        <div class="descargables contenedor-descargables ">
          <span class="title">Descargar</span>
        <a class="btn m-l-1"
          href="#ejeles"
          download
        >PPT
        </a>
        <a class="btn"
          href="#ejeles"
          download
        >PDF
        </a>
        </div>
      </div>
    </div>
    <div class="selectores-antisombra"></div>
    <div class="selectores-sombra"></div>
    <Heatmap v-if="true" />
    <MapaCalorV1 v-if="false" />
    <MapaCalorV2 v-if="false" />
    <Visualization v-if="false" />
  </div>
</template>

<script>
// import Visualization from "@/components/visualization-d3/views/Visualization.vue";
// import SelectorEstados from '@/components/visualizations/heatmap/SelectorEstados.vue';
import SelectorVariantes from '@/components/visualizations/heatmap/SelectorVariantes.vue';
import Heatmap from '@/components/visualizations/heatmap/Heatmap.vue';
// import MapaCalorV1 from '@/components/visualization-d3/views/MapaCalorV1.vue';
// import MapaCalorV2 from '@/components/visualization-d3/views/MapaCalorV2.vue';
</script>-->
