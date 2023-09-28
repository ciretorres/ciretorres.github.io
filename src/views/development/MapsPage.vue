<script setup>
import centroidesJSON from "@/assets/data/centroides-crateres.json"

const centroides = centroidesJSON
</script>

<template>
  <div class="maps">
    <div class="container sin-fondo w-inherit">
      <dai-tarjeta-contenedor-mapa class="contenedor-mapa"
      :permitir-colapso="false"
      :llenar-espacio-disponible-con-mapa="true"
    >
      <template #header>
        <h1>Cráteres de impacto en la Tierra</h1>

        <dai-leyenda-mapa
          :para="['crateres_centroides']"
        />
      </template>

      <dai-mapa class="full-screen-height">
        <dai-capa-xyz-osm />

        <dai-capa-geojson 
          id="crateres_centroides"
          :datos="centroides" 
          :estilo-capa="{circle:{fill:{color:'red'},radius:2}}"
          :contenidoTooltip="(centroide) => `
            <p>Nombre: ${centroide.name}</p>
            <p>Lugar: ${centroide.country}</p>
            <p>Diámetro: ${centroide.diameter_km} km</p>
            <p>Edad: ${centroide.age_ma} ma</p>
          `"
        /> 
      </dai-mapa>
      
      <template v-slot:footer>
      </template>
    </dai-tarjeta-contenedor-mapa>
    <div class="contenedor-fuentes">
      <p class="fuentes">Fuentes:</p>
      <ul>
        <li><a 
          href="https://github.com/conacyt-dai/dai-maps"
          target="_blank"
          rel="noopener noreferrer"
          >https://github.com/conacyt-dai/dai-maps</a></li>
        <li><a 
          href="https://www.houspain.com/gttp/lib/exe/fetch.php?media=escenario_medicion_crateres_impacto_tierra_v1.1.pdf"
          target="_blank"
          rel="noopener noreferrer"
          >https://www.houspain.com/gttp/lib/exe/fetch.php?media=escenario_medicion_crateres_impacto_tierra_v1.1.pdf</a></li>
        <li><a 
          href="https://axxon.com.ar/zap/123/c-ZappingASCrateres.htm"
          target="_blank"
          rel="noopener noreferrer"
          >https://axxon.com.ar/zap/123/c-ZappingASCrateres.htm</a> </li>
        <li><a 
          href="https://es.wikipedia.org/wiki/Anexo:Cr%C3%A1teres_de_la_Tierra"
          target="_blank"
          rel="noopener noreferrer"
          >https://es.wikipedia.org/wiki/Anexo:Cr%C3%A1teres_de_la_Tierra</a></li>
        <li><a 
          href="https://www.yumpu.com/es/document/read/12732459/crateres-de-impacto-en-la-tierra-astrosafor"
          target="_blank"
          rel="noopener noreferrer"
          >https://www.yumpu.com/es/document/read/12732459/crateres-de-impacto-en-la-tierra-astrosafor</a></li>
        <li><a 
          href="http://www.passc.net/EarthImpactDatabase/New%20website_05-2018/NorthAmerica.html"
          target="_blank"
          rel="noopener noreferrer"
          >http://www.passc.net/EarthImpactDatabase/New%20website_05-2018/NorthAmerica.html</a></li>
        <li><a 
          href="https://latlongdata.com/lat-long-converter/"
          target="_blank"
          rel="noopener noreferrer"
          >https://latlongdata.com/lat-long-converter/</a></li>
        <li><a 
          href="https://www.google.com/maps/d/viewer?mid=1NE6bwd2gDetmQANgfL4pzQFp9rda9Z4H&ll=-4.969488996395285%2C-34.89056111878814&z=3"
          target="_blank"
          rel="noopener noreferrer"
          >https://www.google.com/maps/d/viewer?mid=1NE6bwd2gDetmQANgfL4pzQFp9rda9Z4H&ll=-4.969488996395285%2C-34.89056111878814&z=3</a></li>
        <li><a 
          href="https://fondodeculturaeconomica.com/Ficha/9786071657145/F"
          target="_blank"
          rel="noopener noreferrer"
          >https://fondodeculturaeconomica.com/Ficha/9786071657145/F</a></li>
      </ul>
    </div>
    </div>
  </div>
</template>

<style lang="scss">
.maps {
  width: 100%; 
  height: 1000px; 
  /* position: absolute; */
  /* top: 0; */
  left: 0;
}
.contenedor-mapa {
  height: 50%;
  /* height: 1000px; */
}
.contenedor-mapa {
  width: calc(100% - 64px);
  /* background: #fff; */
  background: var(--container-background-color);
  color: #fff;
  display: block;
  margin: 0 auto;
  .custom-checkbox.dai-icon-check {
    color: #000;
  }
}
.full-screen-height {
  /* height: 100%; */
  /* height: 500px; */
  height: auto;
}
.contenedor-fuentes {
  color: #fff;
  a {
    color: #fff;
    overflow-wrap: break-word;
    // word-wrap: break-word;
  }
}
</style>

