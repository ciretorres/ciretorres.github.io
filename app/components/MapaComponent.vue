<script setup>
import centroidesJSON from '@/assets/data/centroides-crateres.json'
import {
  SisdaiCapaVectorial,
  SisdaiCapaXyz,
  SisdaiLeyenda,
  SisdaiMapa,
} from '@centrogeomx/sisdai-mapas'

const centroides = centroidesJSON

const atribuciones = [
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
  '&copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
  '&copy; <a href="https://codigo.conahcyt.mx/sisdai/sisdai-mapas" target="_blank" rel="noopener noreferrer">Sisdai-mapas</a>',
]

const seleccion = {
  // "circulo-relleno": "rgba(255,0,0,1)",
  // "circulo-contorno-color": "#3399CC",
  'circulo-contorno-color': '#111827',
  'circulo-contorno-grosor': 0.8,
  'circulo-radio': 3,
  'circulo-relleno-color': '#ef4444',
  // "contorno-color": "#3399CC",
  'contorno-color': '#111827',
  'contorno-grosor': 1,
  'relleno-color': '#ef4444',
}

function escaparHtml(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatearNumero(valor, decimales = 2) {
  const numero = Number(valor)

  if (!Number.isFinite(numero)) {
    return 'Sin dato'
  }

  return new Intl.NumberFormat('es-MX', {
    maximumFractionDigits: decimales,
  }).format(numero)
}

function globoInformativo(f) {
  // Si tu fuente es GeoJSON, posiblemente debas usar:
  // const propiedades = f.properties ?? f
  const propiedades = f.properties ?? f

  const nombre = escaparHtml(propiedades.name ?? 'Sin nombre')
  const pais = escaparHtml(propiedades.country ?? 'Sin dato')
  const diametro = formatearNumero(propiedades.diameter_km)
  const edad = formatearNumero(propiedades.age_ma)

  return `
    <div class="globo-crater">
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Lugar:</strong> ${pais}</p>
      <p><strong>Diámetro:</strong> ${diametro} km</p>
      <p><strong>Edad:</strong> ${edad} Ma</p>
    </div>
  `
}
</script>

<template>
  <ClientOnly>
    <SisdaiMapa
      class="mapa-crateres contenedor-vis con-panel-encabezado-vis contenedor-vis-atribuciones"
      :vista="{ centro: [0, 0], zoom: 1 }"
    >
      <template #panel-encabezado-vis>
        <SisdaiLeyenda para="crateres_centroides" />
      </template>

      <SisdaiCapaXyz
        id="base"
        :posicion="1"
        url="https://{a-c}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
        :atribuciones="atribuciones"
      />

      <SisdaiCapaVectorial
        id="crateres_centroides"
        nombre="Cráteres"
        :posicion="2"
        :fuente="centroides"
        :estilo="seleccion"
        geometria="punto"
        :renderizar-como-imagen="true"
        :visible="true"
        :globo-informativo="globoInformativo"
      />
    </SisdaiMapa>

    <template #fallback>
      <div
        class="mapa-cargando"
        role="status"
      >
        Cargando mapa…
      </div>
    </template>
  </ClientOnly>
</template>

<style lang="scss" scoped>
// @import 'node_modules/sisdai-css/src/eni.scss';

.mapa-crateres {
  min-height: 600px;
  width: 100%;
}

.globo-crater {
  min-width: 180px;
  max-width: 240px;
  padding: 0.6rem 0.75rem;
  color: #fff;
  background: #1c1c1c;
  border-radius: 0.35rem;
  box-shadow: 0 3px 6px rgb(0 0 0 / 16%);
  font-size: 0.75rem;
  line-height: 1.35;
}

.globo-crater p {
  margin: 0.25rem 0;
}

.mapa-cargando {
  display: grid;
  min-height: 600px;
  place-items: center;
  color: #4b5563;
  background: #f3f4f6;
}
</style>
