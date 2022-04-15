<template>
  <div class="d3js m-5">    
    <h1>d3JS</h1>
    <div class="contenedor">
      <!-- <MapaCalor 
        id="mapa_calor" 
      />

      <Multilinea 
        titulo="Evolución de variantes del virus SARS-CoV-2"
        fecha_actualizacion="dd/mm/aa"
        :datos="datosGrafica"
        :nombre_variables="{ nombre: 'nombre' }"
        :variables="variablesGrafica"
        :alto_vis="400"
        titulo_leyenda="Variantes del virus SARS-CoV-2" 
      />

      <Area 
        :area_id="'area'"
        :datos="datosArea"
        :titulo_proyecto="'Título/enlace del proyecto'"
        fecha_actualizacion="dd/mm/aaaa"
        titulo_eje_x="Título eje x"
        titulo_eje_y="Título eje y"
        titulo_leyenda="Título de leyenda"
        color_area="#000" 
      /> -->
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";

import consorcioEvolucionVariantes from '@/assets/datasets/consorcio_evolucion_variantes.json';
import dataJSON from '@/assets/data/area/data.json';


// import MapaCalor from '@/components/visualizations/heatmap/MapaDeCalor.vue';
// import Multilinea from '@/components/visualizations/multilinea/Multilinea.vue'
// import Area from '@/components/visualizations/area/Area.vue'

const dictValuesVariantes = {
  variante_preocupacion: 'VOC',
  variante_interes: 'VOI',
  variante_interes_nacional: 'VIN',
  variante_monitoreo: 'VOM',
  variante_sin_clasificacion: 'VSIN',
};
const dictColorsVariantes = {
  variante_preocupacion: '#C45016',
  variante_interes: '#58508D',
  variante_interes_nacional: '#60802F',
  variante_monitoreo: '#128984',
  variante_sin_clasificacion: '#085373N',
};
/* eslint-disable */
const variables = Object.entries(dictValuesVariantes).map((variante) => {
  return {
    color: dictColorsVariantes[variante[0]],
    id: variante[0],
    nombre: variante[1],
  };
});
// preparando diccionario general nacional
const diccionarioNacional = consorcioEvolucionVariantes;
// const diNa = consorcioEvolucionVariantes.reduce((acum, current)=> {
//   console.log(current);
// });
// console.log("dic",diccionarioNacional);

export default {
  name: 'D3JS',
  components: {
    // MapaCalor,
    // Multilinea,
    // Area,

  },
  data() {
    return {
      // diccionarioDatos: diccionarioNacional,
      datosGrafica: diccionarioNacional,
      // datosGrafica: [],
      variablesGrafica: variables,
      datos_area: [
        {"date": "2013-11-01", "value": 206.65},
        {"date": "2013-11-02", "value": 207.76},
        {"date": "2013-11-03", "value": 215.05},
        {"date": "2013-11-04", "value": 231.01},
        {"date": "2013-11-05", "value": 250.66},
        {"date": "2013-11-06", "value": 263},
        {"date": "2013-11-07", "value": 304.17},
        {"date": "2013-11-08", "value": 338.66},
        {"date": "2013-11-09", "value": 370.82},
        {"date": "2013-11-10", "value": 350.7},
        {"date": "2013-11-11", "value": 351.27},
        {"date": "2013-11-12", "value": 362.81},
        {"date": "2013-11-13", "value": 414.05},
        {"date": "2013-11-14", "value": 425.9},
        {"date": "2013-11-15", "value": 437.89},
        {"date": "2013-11-16", "value": 450.26},
        {"date": "2013-11-17", "value": 500.58},
        {"date": "2013-11-18", "value": 703.78},
        {"date": "2013-11-19", "value": 806.11},
        {"date": "2013-11-20", "value": 599.65},
        {"date": "2013-11-21", "value": 733.4},
        {"date": "2013-11-22", "value": 780.85},
        {"date": "2013-11-23", "value": 844.97},
        {"date": "2013-11-24", "value": 807.36},
        {"date": "2013-11-25", "value": 810.68},
        {"date": "2013-11-26", "value": 928.54},
        {"date": "2013-11-27", "value": 1001.96},
        {"date": "2013-11-28", "value": 1077.56},
        {"date": "2013-11-29", "value": 1146.97},
        {"date": "2013-11-30", "value": 1156.14},
        {"date": "2013-12-01", "value": 1133.08},
        {"date": "2013-12-02", "value": 1055.42},
        {"date": "2013-12-03", "value": 1096},
        {"date": "2013-12-04", "value": 1156.12},
        {"date": "2013-12-05", "value": 1154.36},
        {"date": "2013-12-06", "value": 1042.38},
        {"date": "2013-12-07", "value": 854.64},
        {"date": "2013-12-08", "value": 802.51},
        {"date": "2013-12-09", "value": 921.93},
        {"date": "2013-12-10", "value": 997.23},
        {"date": "2013-12-11", "value": 1001.58},
        {"date": "2013-12-12", "value": 901.94},
        {"date": "2013-12-13", "value": 941.79},
        {"date": "2013-12-14", "value": 904.65},
        {"date": "2013-12-15", "value": 886.16},
        {"date": "2013-12-16", "value": 882.25},
        {"date": "2013-12-17", "value": 754.83},
        {"date": "2013-12-18", "value": 679.32},
        {"date": "2013-12-19", "value": 707.23},
        {"date": "2013-12-20", "value": 729.16},
        {"date": "2013-12-21", "value": 654.27},
        {"date": "2013-12-22", "value": 666.74},
        {"date": "2013-12-23", "value": 680.91},
        {"date": "2013-12-24", "value": 684.39},
        {"date": "2013-12-25", "value": 682.7},
        {"date": "2013-12-26", "value": 777.75},
        {"date": "2013-12-27", "value": 777.51},
        {"date": "2013-12-28", "value": 747.06},
        {"date": "2013-12-29", "value": 748.61},
        {"date": "2013-12-30", "value": 766.6},
        {"date": "2013-12-31", "value": 760.58},
      ],
      // datos_area: datJSON,
      dato_area: [],
    };
  },
  computed: {
    datosArea() {
      dataJSON.forEach(d => {
        // Parse data
        d.date = d3.timeParse("%Y-%m-%d")(d.date);
        d.value = +d.value;
      });
      return dataJSON;
    },
  },
}
</script>

<style lang="scss">
</style>
