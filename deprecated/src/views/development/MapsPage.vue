<script setup>
import MapaComponent from '@/components/visualizations/maps/MapaComponent.vue'
</script>

<template>
  <div class="maps">
    <div class="container sin-fondo my-8">
      <h1>Mapas</h1>
      <MapaComponent></MapaComponent>

      <div class="contenedor-fuentes">
        <p class="fuentes">Fuentes:</p>
        <ul>
          <li>
            <a href="https://codigo.conahcyt.mx/sisdai/sisdai-mapas"
              >https://codigo.conahcyt.mx/sisdai/sisdai-mapas</a
            >
          </li>
          <li>
            <a
              href="https://www.houspain.com/gttp/lib/exe/fetch.php?media=escenario_medicion_crateres_impacto_tierra_v1.1.pdf"
              >https://www.houspain.com/gttp/lib/exe/fetch.php?media=escenario_medicion_crateres_impacto_tierra_v1.1.pdf</a
            >,
          </li>
          <li>
            <a href="https://axxon.com.ar/zap/123/c-ZappingASCrateres.htm"
              >https://axxon.com.ar/zap/123/c-ZappingASCrateres.htm</a
            >,
          </li>
          <li>
            <a href="https://es.wikipedia.org/wiki/Anexo:Cr%C3%A1teres_de_la_Tierra"
              >https://es.wikipedia.org/wiki/Anexo:Cr%C3%A1teres_de_la_Tierra</a
            >,
          </li>
          <li>
            <a
              href="https://www.yumpu.com/es/document/read/12732459/crateres-de-impacto-en-la-tierra-astrosafor"
              >https://www.yumpu.com/es/document/read/12732459/crateres-de-impacto-en-la-tierra-astrosafor</a
            >,
          </li>
          <li>
            <a
              href="http://www.passc.net/EarthImpactDatabase/New%20website_05-2018/NorthAmerica.html"
              >http://www.passc.net/EarthImpactDatabase/New%20website_05-2018/NorthAmerica.html</a
            >,
          </li>
          <li>
            <a href="https://latlongdata.com/lat-long-converter/"
              >https://latlongdata.com/lat-long-converter/</a
            >,
          </li>
          <li>
            <a
              href="https://www.google.com/maps/d/viewer?mid=1NE6bwd2gDetmQANgfL4pzQFp9rda9Z4H&ll=-4.969488996395285%2C-34.89056111878814&z=3"
              >https://www.google.com/maps/d/viewer?mid=1NE6bwd2gDetmQANgfL4pzQFp9rda9Z4H&ll=-4.969488996395285%2C-34.89056111878814&z=3</a
            >,
          </li>
          <li>
            <a href="https://fondodeculturaeconomica.com/Ficha/9786071657145/F"
              >https://fondodeculturaeconomica.com/Ficha/9786071657145/F</a
            >
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
        height: 515px;
      }
      .contenedor-vis-atribuciones {
      display: none;
    }  
  }
}
</style>

<style lang="scss" scoped>
// .maps {
//   width: 100%;
//   height: 100%;
//   /* position: absolute; */
//   /* top: 0; */
//   left: 0;
// }
// .contenedor-mapa {
//   height: 90%;
// }
// .contenedor-mapa,
.contenedor-fuentes {
  width: calc(100% - 64px);
  background: #fff;
  display: block;
  margin: 0 auto;
}
// .full-screen-height {
//   height: 100%;
// }
.fuentes {
  color: #000;
}
</style>
