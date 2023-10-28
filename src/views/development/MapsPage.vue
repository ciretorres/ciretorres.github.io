<script setup>
import MapaComponent from '@/components/visualizations/maps/MapaComponent.vue'

const fuentes = [
  { href: 'https://codigo.conahcyt.mx/sisdai/sisdai-mapas' },
  {
    href: 'https://www.houspain.com/gttp/lib/exe/fetch.php?media=escenario_medicion_crateres_impacto_tierra_v1.1.pdf'
  },
  { href: 'https://axxon.com.ar/zap/123/c-ZappingASCrateres.htm' },
  { href: 'https://es.wikipedia.org/wiki/Anexo:Cr%C3%A1teres_de_la_Tierra' },
  {
    href: 'https://www.yumpu.com/es/document/read/12732459/crateres-de-impacto-en-la-tierra-astrosafor'
  },
  { href: 'http://www.passc.net/EarthImpactDatabase/New%20website_05-2018/NorthAmerica.html' },
  { href: 'https://latlongdata.com/lat-long-converter/' },
  {
    href: 'https://www.google.com/maps/d/viewer?mid=1NE6bwd2gDetmQANgfL4pzQFp9rda9Z4H&ll=-4.969488996395285%2C-34.89056111878814&z=3'
  },
  { href: 'https://fondodeculturaeconomica.com/Ficha/9786071657145/F' }
]
</script>

<template>
  <div class="maps">
    <div class="container sin-fondo my-8">
      <h1>Mapas</h1>
      <MapaComponent></MapaComponent>
    </div>
    <div class="container">
      <div class="contenedor-fuentes">
        <p class="fuentes">Fuentes:</p>
        <ul>
          <li v-for="(fuente, idx) in fuentes" :key="idx">
            <a :href="fuente.href" target="_blank" rel="noopener noreferrer">{{ fuente.href }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
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
.contenedor-fuentes {
  // word-wrap: break-word;
  word-break: break-all;
  // overflow-x: auto;
  // width: calc(100% - 64px);
  // background: #fff;
  // display: block;
  // margin: 0 auto;
  padding: 8px 16px;
  li {
    a {
      color: #fff;
    }
    margin-bottom: 16px;
  }
}
// .full-screen-height {
//   height: 100%;
// }
.fuentes {
  // color: #000;
}
</style>
