<script setup>
import SankeyComponent2 from './components/SankeyComponent2.vue'
import SankeyComponent3 from './components/SankeyComponent3.vue'

const datos = {
  nodes: [
    { node: 9, name: 'Pino', id: 'node9', color: '#846026' },
    { node: 10, name: 'Encino', id: 'node10', color: '#f69633' },
    { node: 11, name: 'Tropicales 1', id: 'node11', color: '#a7bd14' },
    { node: 12, name: 'Matorrales', id: 'node12', color: '#f95e2c' },
    { node: 7, name: 'Aserradero', id: 'node7', color: '#999' },
    { node: 19, name: 'Leña', id: 'node20', color: '#999' },
    {
      node: 5,
      name: 'Importación\nde carbón\ny leña',
      id: 'node5',
      color: '#646e12',
    },
    {
      node: 6,
      name: 'Importación\nde madera\nen rollo',
      id: 'node6',
      color: '#acb83f',
    },
    { node: 13, name: 'Caña', id: 'node13', color: '#198d26' },
    { node: 14, name: 'Maíz y\notros', id: 'node14', color: '#198d26' },
    {
      node: 17,
      name: 'Árboles\nfrutales',
      id: 'node17',
      color: '#d0df15',
    },
    { node: 16, name: 'Agave', id: 'node16', color: '#acc203' },
    {
      node: 20,
      name: 'Pino y otras\nconíferas',
      id: 'node19',
      color: '#999',
    },
    {
      node: 22,
      name: 'Encino\ny otras\nlatifoliadas',
      id: 'node22',
      color: '#999',
    },
    { node: 23, name: 'Hornos de\ncarbón', id: 'node23', color: '#999' },
    { node: 24, name: 'Tropicales', id: 'node24', color: '#999' },
    { node: 25, name: 'Bagazo', id: 'node25', color: '#999' },
    { node: 26, name: 'RAC', id: 'node26', color: '#999' },
    { node: 28, name: 'Olote', id: 'node27', color: '#999' },
    { node: 29, name: 'Carbón vegetal', id: 'node29', color: '#999' },
    { node: 30, name: 'Aserrín y otros', id: 'node30', color: '#999' },
    {
      node: 31,
      name: 'Astillas y\npellets',
      id: 'node31',
      color: '#999',
    },
    {
      node: 32,
      name: 'Otros productos maderables y no maderables',
      id: 'node31',
      color: '#999',
    },
    { node: 35, name: 'Residencial', id: 'node35', color: '#999' },
    { node: 33, name: 'Comercio', id: 'node33', color: '#999' },
    { node: 34, name: 'Industrial', id: 'node34', color: '#999' },
    {
      node: 36,
      name: 'Usos no\nenergéticos',
      id: 'node36',
      color: '#999',
    },
    { node: 8, name: 'Exportaciones', id: 'node8', color: '#999' },
  ],
  links: [
    { source: 'Pino', target: 'Leña', value: 3.12, color: '#846026' },
    {
      source: 'Pino',
      target: 'Pino y otras\nconíferas',
      value: 17.25,
      color: '#846026',
    },
    {
      source: 'Encino',
      target: 'Encino\ny otras\nlatifoliadas',
      value: 9.63,
      color: '#f69633',
    },
    {
      source: 'Encino',
      target: 'Hornos de\ncarbón',
      value: 3.13,
      color: '#f69633',
    },
    { source: 'Encino', target: 'Leña', value: 6.24, color: '#f69633' },
    {
      source: 'Tropicales 1',
      target: 'Hornos de\ncarbón',
      value: 0.59,
      color: '#a7bd14',
    },
    {
      source: 'Tropicales 1',
      target: 'Leña',
      value: 4.68,
      color: '#adc015',
    },
    {
      source: 'Tropicales 1',
      target: 'Tropicales',
      value: 3.14,
      color: '#adc015',
    },
    {
      source: 'Matorrales',
      target: 'Hornos de\ncarbón',
      value: 0.2,
      color: '#f95e2c',
    },
    {
      source: 'Matorrales',
      target: 'Leña',
      value: 0.78,
      color: '#f95e2c',
    },
    {
      source: 'Importación\nde carbón\ny leña',
      target: 'Leña',
      value: 0.01,
      color: '#646e12',
    },
    {
      source: 'Importación\nde carbón\ny leña',
      target: 'Carbón vegetal',
      value: 0.01,
      color: '#646e12',
    },
    {
      source: 'Importación\nde madera\nen rollo',
      target: 'Aserradero',
      value: 0.0175655,
      color: '#acb83f',
    },
    {
      source: 'Pino y otras\nconíferas',
      target: 'Aserradero',
      value: 13.18,
      color: '#b6906e',
    },
    {
      source: 'Pino y otras\nconíferas',
      target: 'Astillas y\npellets',
      value: 1.32,
      color: '#b6906e',
    },
    {
      source: 'Pino y otras\nconíferas',
      target: 'Exportaciones',
      value: 0.02,
      color: '#b6906e',
    },
    {
      source: 'Pino y otras\nconíferas',
      target: 'Leña',
      value: 2.73,
      color: '#b6906e',
    },
    {
      source: 'Encino\ny otras\nlatifoliadas',
      target: 'Aserradero',
      value: 6.93,
      color: '#b6906e',
    },
    {
      source: 'Encino\ny otras\nlatifoliadas',
      target: 'Hornos de\ncarbón',
      value: 1.4,
      color: '#b6906e',
    },
    {
      source: 'Encino\ny otras\nlatifoliadas',
      target: 'Leña',
      value: 1.3,
      color: '#b6906e',
    },
    {
      source: 'Tropicales',
      target: 'Aserradero',
      value: 2.23,
      color: '#656c43',
    },
    {
      source: 'Tropicales',
      target: 'Hornos de\ncarbón',
      value: 0.5,
      color: '#656c43',
    },
    {
      source: 'Tropicales',
      target: 'Leña',
      value: 0.39,
      color: '#656c43',
    },
    {
      source: 'Tropicales',
      target: 'Exportaciones',
      value: 0.02,
      color: '#656c43',
    },
    { source: 'Caña', target: 'RAC', value: 8.4, color: '#198d26' },
    { source: 'Caña', target: 'Bagazo', value: 7.6, color: '#168f25' },
    {
      source: 'Maíz y\notros',
      target: 'Olote',
      value: 7,
      color: '#198e21',
    },
    {
      source: 'Árboles\nfrutales',
      target: 'Aserradero',
      value: 1,
      color: '#d0df15',
    },
    {
      source: 'Árboles\nfrutales',
      target: 'Leña',
      value: 0.78,
      color: '#e9ef7f',
    },
    { source: 'Agave', target: 'Bagazo', value: 1.5, color: '#acc203' },
    {
      source: 'Hornos de\ncarbón',
      target: 'Carbón vegetal',
      value: 7.64,
      color: '#a04e04',
    },
    {
      source: 'Aserradero',
      target: 'Aserrín y otros',
      value: 2.1,
      color: '#fb5b29',
    },
    {
      source: 'Aserradero',
      target: 'Astillas y\npellets',
      value: 2.46,
      color: '#fc6e46',
    },
    {
      source: 'Aserradero',
      target: 'Leña',
      value: 1.46,
      color: '#fc6e46',
    },
    {
      source: 'Aserradero',
      target: 'Otros productos maderables y no maderables',
      value: 15.52,
      color: '#522007',
    },
    {
      source: 'Aserradero',
      target: 'Hornos de\ncarbón',
      value: 1.82,
      color: '#748116',
    },
    { source: 'Leña', target: 'Comercio', value: 0.72, color: '#d39e93' },
    {
      source: 'Leña',
      target: 'Industrial',
      value: 1.52,
      color: '#ef3f11',
    },
    {
      source: 'Leña',
      target: 'Residencial',
      value: 19.1,
      color: '#845f29',
    },
    {
      source: 'Leña',
      target: 'Exportaciones',
      value: 0.15,
      color: '#845f29',
    },
    {
      source: 'Carbón vegetal',
      target: 'Comercio',
      value: 0.22,
      color: '#d39e93',
    },
    {
      source: 'Carbón vegetal',
      target: 'Industrial',
      value: 3,
      color: '#f33e03',
    },
    {
      source: 'Carbón vegetal',
      target: 'Residencial',
      value: 2.9,
      color: '#9b5205',
    },
    {
      source: 'Carbón vegetal',
      target: 'Exportaciones',
      value: 0.52,
      color: '#9b5205',
    },
    {
      source: 'Aserrín y otros',
      target: 'Industrial',
      value: 1.05,
      color: '#b05e06',
    },
    {
      source: 'Aserrín y otros',
      target: 'Usos no\nenergéticos',
      value: 1.05,
      color: '#ea4110',
    },
    {
      source: 'Astillas y\npellets',
      target: 'Industrial',
      value: 1.39,
      color: '#fb3a04',
    },
    {
      source: 'Astillas y\npellets',
      target: 'Usos no\nenergéticos',
      value: 2.39,
      color: '#ee4009',
    },
    {
      source: 'Otros productos maderables y no maderables',
      target: 'Usos no\nenergéticos',
      value: 14.45,
      color: '#a7bc17',
    },
    {
      source: 'Otros productos maderables y no maderables',
      target: 'Exportaciones',
      value: 1.07,
      color: '#a7bc17',
    },
    {
      source: 'Bagazo',
      target: 'Industrial',
      value: 9.1,
      color: '#1d8b26',
    },
    {
      source: 'Olote',
      target: 'Usos no\nenergéticos',
      value: 3.5,
      color: '#198d23',
    },
    {
      source: 'Olote',
      target: 'Residencial',
      value: 3.5,
      color: '#198d23',
    },
    {
      source: 'RAC',
      target: 'Usos no\nenergéticos',
      value: 8.4,
      color: '#198d23',
    },
  ],
}
</script>

<template>
  <div class="pruebas-view p-5">
    <h1>Pruebas</h1>
    <SankeyComponent2 v-if="false" />
    <SankeyComponent3
      sankey_id="sankeyBiomasa"
      titulo="Estado actual de la biomasa en México"
      fecha_actualizacion="Datos para 2022"
      :datos="datos"
      titulo_eje_x="TWh"
      titulo_leyenda="Sector industrial"
      texto_notas="Notas:1) La producción no incluye autogeneración de energía eléctrica. 2) El consumo propio del sector incluye autoconsumo por generación y transmisión. 3) La diferencia estadística equivale a los excedentes de autogeneradores de energía eléctrica. 4) A partir de 2016 se incluye información de las centrales eléctricas con permiso de generación otorgado por la CRE."
      texto_fuente="Sistema de Información Energética (SIE) con información de SENER. Recuperado en marzo de 2021. www.sie.energia.gob.mx"
    />
  </div>
</template>
