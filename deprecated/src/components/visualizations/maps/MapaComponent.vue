<script setup>
import centroidesJSON from '@/assets/data/centroides-crateres.json'
const centroides = centroidesJSON

const atribuciones = [
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  '&copy; <a href="https://carto.com/attributions">CARTO</a>',
]

const seleccion = {
  // "circulo-relleno": "rgba(255,0,0,1)",
  // "circulo-contorno-color": "#3399CC",
  "circulo-contorno-color": "black",
  "circulo-contorno-grosor": 0.1,
  "circulo-radio": 2,
  // "contorno-color": "#3399CC",
  "contorno-color": "black",
  "contorno-grosor": 1,
  "relleno-color": "rgba(255,0,0,1)",
  'circulo-relleno-color': 'rojo',
}

function globoInformativo(f) {
  return `
  <div style="background: #1c1c1c;
    color: #fff;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1607843137);
    border-radius: 4px;
    z-index: 9999;
    font-size: 11px;min-height: 0;
    padding: 0.5em;
    width: auto;
    max-width: 240px;"
  >
    <p>Nombre: <b>${f.name}</b></p>
    <p>Lugar: <b>${f.country}</b></p>
    <p>Diámetro: <b>${f.diameter_km} km</b></p>
    <p>Edad: <b>${f.age_ma} ma</b></p>
  </div>`
}
</script>

<template>
  <SisdaiMapa 
    class="contenedor-vis con-panel-encabezado-vis contenedor-vis-atribuciones" 
    :vista="{ centro: [0, 0], zoom: 1 }">
    <template #panel-encabezado-vis>
      <div class="m-r-2">
        <h5 class="texto-color-1 m-y-0">Cráteres de impacto en la Tierra</h5>
        <SisdaiLeyenda para="crateres_centroides" />
      </div>
    </template>

    <SisdaiCapaXyz
      id="base"
      :posicion="1"
      url="https://{a-c}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
      :atribuciones="atribuciones"
    />

    <SisdaiCapaVectorial 
      id="crateres_centroides"
      nombre="crateres_centroides"
      :posicion="2"
      :fuente="centroides" 
      :estilo="seleccion"
      geometria="punto"
      :renderizarComoImagen="true"
      :visible="true"
      :globoInformativo="f => globoInformativo(f)"
    />
  </SisdaiMapa>
</template>

<style lang="scss" scoped>
@import 'node_modules/sisdai-css/src/eni.scss';
</style>