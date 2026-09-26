<script setup>
import { nextTick, onMounted, onBeforeUnmount, ref } from 'vue'

import Map from 'ol/Map.js'
import View from 'ol/View.js'
import Overlay from 'ol/Overlay.js'

import ScaleLine from 'ol/control/ScaleLine.js'
import { defaults as defaultControls } from 'ol/control/defaults.js'

import TileLayer from 'ol/layer/Tile.js'
import VectorLayer from 'ol/layer/Vector.js'

// import OSM from 'ol/source/OSM.js'
import XYZ from 'ol/source/XYZ.js'
import VectorSource from 'ol/source/Vector.js'

import GeoJSON from 'ol/format/GeoJSON.js'

import Style from 'ol/style/Style.js'
import CircleStyle from 'ol/style/Circle.js'
import Fill from 'ol/style/Fill.js'
import Stroke from 'ol/style/Stroke.js'

import { fromLonLat } from 'ol/proj.js'

import { unByKey } from 'ol/Observable.js'

import 'ol/ol.css'

// import centroidesJSON from '@/assets/data/centroides-crateres.json'
const props = defineProps({
  centroides: {
    type: Object,
    default: () => ({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-99.1332, 19.4326],
          },
          properties: {
            nombre: 'Cráter de ejemplo',
            country: 'México',
            diameter_km: 2.5,
            age_ma: 10,
          },
        },
      ],
    }),
  },
})

const mapaElemento = ref(null)
const popupElemento = ref(null)

let mapa
let popup
let listenerPointerMove

onMounted(async () => {
  if (!mapaElemento.value || !popupElemento.value) {
    return
  }

  // revisa api key carto
  const config = useRuntimeConfig()
  const apiKey = config.public.cartoApiKey

  console.log('API key disponible:', Boolean(apiKey))

  if (!apiKey) {
    console.error('La API key de CARTO está vacía o no fue configurada')
    return
  }

  const crateres = new GeoJSON().readFeatures(props.centroides, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857',
  })

  const capaCrateres = new VectorLayer({
    source: new VectorSource({
      features: crateres,
    }),
    style: new Style({
      image: new CircleStyle({
        radius: 3,
        fill: new Fill({
          color: '#ef4444',
        }),
        stroke: new Stroke({
          color: '#111827',
          width: 0.8,
        }),
      }),
    }),
  })

  const capaBase = new TileLayer({
    // source: new OSM({
    //   attributions: [
    //     '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
    //   ],
    // }),
    source: new XYZ({
      url: `https://{a-c}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${encodeURIComponent(apiKey)}`,
      attributions: ['&copy; OpenStreetMap contributors', '&copy; CARTO'],
    }),
  })

  const escala = new ScaleLine({
    units: 'metric',
    bar: true,
    steps: 4,
    text: true,
    minWidth: 120,
  })

  popup = new Overlay({
    element: popupElemento.value,
    positioning: 'bottom-center',
    // stopEvent: true,
    stopEvent: false,
    offset: [0, -8],
  })

  mapa = new Map({
    target: mapaElemento.value,
    controls: defaultControls().extend([escala]),
    layers: [capaBase, capaCrateres],
    overlays: [popup],
    view: new View({
      center: fromLonLat([0, 0]),
      zoom: 1,
    }),
  })

  listenerPointerMove = mapa.on('pointermove', evento => {
    if (evento.dragging) {
      return
    }

    const feature = mapa.forEachFeatureAtPixel(
      evento.pixel,
      (featureEncontrado, capa) => {
        // Solo detectar puntos de la capa de cráteres
        if (capa === capaCrateres) {
          return featureEncontrado
        }

        return undefined
      },
      {
        hitTolerance: 6,
      }
    )

    if (!feature) {
      popupElemento.value.innerHTML = ''
      popup.setPosition(undefined)
      mapa.getTargetElement().style.cursor = ''
      return
    }

    mapa.getTargetElement().style.cursor = 'pointer'

    const propiedades = feature.getProperties()

    // Cambia estos nombres por los campos reales de tu JSON
    const nombre = propiedades.nombre ?? propiedades.name ?? 'Cráter sin nombre'
    const pais = propiedades.country
    const diametro = propiedades.diameter_km ?? propiedades.diameter_km
    const edad = propiedades.age_ma

    popupElemento.value.innerHTML = `
    <div class="globo-crater">
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Lugar:</strong> ${pais}</p>
      <p><strong>Diámetro:</strong> ${diametro} km</p>
      <p><strong>Edad:</strong> ${edad} Ma</p>
    </div>
  `

    popup.setPosition(evento.coordinate)
  })

  await nextTick()

  setTimeout(() => {
    mapa?.updateSize()
  }, 100)
})

onBeforeUnmount(() => {
  if (listenerPointerMove) {
    unByKey(listenerPointerMove)
    listenerPointerMove = undefined
  }

  if (mapa) {
    mapa.setTarget(undefined)
    mapa = undefined
  }
})
</script>

<template>
  <div class="mapa-contenedor">
    <div
      ref="mapaElemento"
      class="mapa"
    />

    <div class="leyenda">
      <strong>Cráteres</strong>

      <div class="leyenda-item">
        <span class="leyenda-punto" />
        Ubicación del cráter
      </div>
    </div>

    <div
      ref="popupElemento"
      class="popup"
    />
  </div>
</template>

<style scoped>
.mapa-contenedor {
  position: relative;
  width: 100%;
  height: 600px;
}

.mapa {
  width: 100%;
  height: 600px;
}

.leyenda {
  position: absolute;
  z-index: 10;
  top: 1rem;
  right: 1rem;
  min-width: 150px;
  padding: 0.75rem;
  color: #111827;
  background: white;
  border-radius: 0.35rem;
  box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
  font-size: 0.8rem;
}

.leyenda-item {
  display: flex;
  gap: 0.45rem;
  align-items: center;
  margin-top: 0.5rem;
}

.leyenda-punto {
  display: inline-block;
  width: 9px;
  height: 9px;
  background: #ef4444;
  border: 1px solid #111827;
  border-radius: 50%;
}

.popup {
  position: absolute;
  z-index: 20;
  min-width: 180px;
  max-width: 240px;
  pointer-events: none;
}

:deep(.globo-crater) {
  position: relative;
  padding: 0.75rem;
  color: white;
  background: #1c1c1c;
  border-radius: 0.35rem;
  box-shadow: 0 3px 6px rgb(0 0 0 / 20%);
  font-size: 0.75rem;
  line-height: 1.35;
}

:deep(.globo-crater p) {
  margin: 0.25rem 0;
}

:deep(.globo-cerrar) {
  position: absolute;
  top: 0.2rem;
  right: 0.35rem;
  padding: 0;
  color: white;
  background: transparent;
  border: 0;
  font-size: 1.1rem;
  cursor: pointer;
}

:deep(.ol-scale-bar) {
  left: 0.75rem;
  bottom: 0.75rem;
  top: auto;
  right: auto;
}

.ol-scale-bar {
  padding: 0.25rem;
  background: rgb(255 255 255 / 75%);
  border-radius: 0.25rem;
}

.ol-scale-step-text,
.ol-scale-step-marker {
  color: #111827;
}

.ol-scale-singlebar-even {
  background-color: #111827;
}

.ol-scale-singlebar-odd {
  background-color: white;
}

.mapa-cargando {
  display: grid;
  min-height: 600px;
  place-items: center;
  color: #4b5563;
  background: #f3f4f6;
}
</style>
