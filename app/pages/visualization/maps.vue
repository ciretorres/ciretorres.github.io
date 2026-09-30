<script setup>
import { defineAsyncComponent, onMounted, ref } from 'vue'

import { useDatosApi } from '@/composables/usarDatosApi'
const { consultarDatos } = useDatosApi('data/centroides-crateres.json')

const MapaComponent = defineAsyncComponent(
  () => import('@/components/MapaComponent.vue')
)

const centroidesJSON = ref(null)

const fuentes = [
  { href: 'https://gitlab.com/sisdai-org/sisdai-mapas' },
  {
    href: 'https://www.houspain.com/gttp/lib/exe/fetch.php?media=escenario_medicion_crateres_impacto_tierra_v1.1.pdf',
  },
  { href: 'https://axxon.com.ar/zap/123/c-ZappingASCrateres.htm' },
  { href: 'https://es.wikipedia.org/wiki/Anexo:Cr%C3%A1teres_de_la_Tierra' },
  {
    href: 'https://www.yumpu.com/es/document/read/12732459/crateres-de-impacto-en-la-tierra-astrosafor',
  },
  {
    href: 'http://www.passc.net/EarthImpactDatabase/New%20website_05-2018/NorthAmerica.html',
  },
  { href: 'https://latlongdata.com/lat-long-converter/' },
  {
    href: 'https://www.google.com/maps/d/viewer?mid=1NE6bwd2gDetmQANgfL4pzQFp9rda9Z4H&ll=-4.969488996395285%2C-34.89056111878814&z=3',
  },
  { href: 'https://fondodeculturaeconomica.com/Ficha/9786071657145/F' },
]

onMounted(async () => {
  centroidesJSON.value = await consultarDatos()
})
</script>

<template>
  <section class="maps">
    <section aria-label="Mapas introducción">
      <h3>Mapas</h3>
      <h4>Cráteres de impacto en la Tierra</h4>
    </section>

    <section aria-label="Mapa componente">
      <ClientOnly>
        <MapaComponent
          v-if="centroidesJSON"
          :centroides="centroidesJSON"
        />

        <template #fallback>
          <div
            class="mapa-cargando"
            role="status"
          >
            Cargando mapa…
          </div>
        </template>
      </ClientOnly>

      <p>
        Este proyecto nació de la curiosidad por aprender a usar la biblioteca
        de mapas SisdaiMapas y comprender su funcionamiento a nivel de código
        fuente. Busqué uno por uno los puntos o cráteres de manera manual en
        distintas páginas de coordenadas geográficas.
      </p>
    </section>

    <section aria-label="Base de datos">
      <h3>Base datos de centroides cráteres</h3>

      <pre v-if="centroidesJSON"><code>{{
        JSON.stringify(centroidesJSON, null, 2)
      }}</code></pre>

      <p>
        <a
          href="https://raw.githubusercontent.com/ciretorres/ciretorres.github.io/refs/heads/develop/src/assets/data/centroides-crateres.json"
          download="centroides-crateres.json"
        >
          Descargar json
        </a>
      </p>
    </section>

    <section aria-label="Fuentes bibliográficas">
      <h3>Fuentes:</h3>

      <ul class="lista-fuentes">
        <li
          v-for="(fuente, idx) in fuentes"
          :key="idx"
        >
          <a
            :href="fuente.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ fuente.href }}
          </a>
        </li>
      </ul>
    </section>
  </section>
</template>

<style lang="scss">
.maps {
  .sisdai-mapa.contenedor-vis {
    background: transparent;
    padding: 0;
    .contenido-vis {
      height: 400px;
    }
    .contenedor-vis-atribuciones {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
.lista-fuentes {
  word-wrap: break-word;
  // word-break: break-all;
  padding: 0 16px;
}
</style>
