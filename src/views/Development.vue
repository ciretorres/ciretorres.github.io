<template>
  <div class="development">
    <div class="container p-2">
      <p class="color-red">[Other stuff...]</p>
      <ul>
        <li><a @click="descubirSitios()" class="color-white">Frontend <span class="color-yellow">[Conacyt]</span></a></li>
        <ul v-show="mostrar">
          <li><a href="https://eni.conacyt.mx/" class="color-white" target="_blank" rel="noopener noreferrer">Ecosistemas Nacionales Informáticos</a></li>
          <ul>
            <li><a href="https://salud.conacyt.mx/" class="color-white" target="_blank" rel="noopener noreferrer">Salud</a></li>
            <ul>
              <li><a href="https://salud.conacyt.mx/vih/" class="color-white" target="_blank" rel="noopener noreferrer">VIH</a></li>
              <li><a href="https://salud.conacyt.mx/coronavirus/" class="color-white" target="_blank" rel="noopener noreferrer">Coronavirus</a></li>
              <ul>
                <li><a href="https://salud.conacyt.mx/coronavirus/variantes/" class="color-white" target="_blank" rel="noopener noreferrer">Variantes</a></li>
              <li><a href="https://salud.conacyt.mx/coronavirus/vacunacion/" class="color-white" target="_blank" rel="noopener noreferrer">Vacunacion</a></li>
              </ul>
            </ul>
          </ul>
          <ul>
            <li><a href="https://alimentacion.conacyt.mx/" class="color-white" target="_blank" rel="noopener noreferrer">Soberanía alimentaria</a></li>
            <ul>
              <li><a href="https://alimentacion.conacyt.mx/glifosato/" class="color-white" target="_blank" rel="noopener noreferrer">Glifosato</a></li>
              <li><a href="https://alimentacion.conacyt.mx/piesagiles/" class="color-white" target="_blank" rel="noopener noreferrer">Pies ágiles</a></li>              
            </ul>
          </ul>
          <ul>
            <li>Socioecología</li>
            <ul>
              <li><a href="https://socioecologia.conacyt.mx/texcoco/" class="color-white" target="_blank" rel="noopener noreferrer">Texcoco</a></li>
            </ul>
          </ul>
          <ul>
            <li><a href="https://energia.conacyt.mx/" class="color-white" target="_blank" rel="noopener noreferrer">Energía y cambio climático</a></li>
            <ul>
              <li><a href="https://energia.conacyt.mx/sargazo/" class="color-white" target="_blank" rel="noopener noreferrer">Sargazo</a></li>
              <li><a href="https://energia.conacyt.mx/planeas/" class="color-white" target="_blank" rel="noopener noreferrer">Planeas</a></li>
            </ul>
          </ul>
          <ul>
            <li>Agua</li>
            <ul>
              <li><a href="https://agua.conacyt.mx/cuencas/" class="color-white" target="_blank" rel="noopener noreferrer">Cuencas</a></li>
            </ul>
          </ul>
        </ul>        
        <li><router-link target="_blank" class="color-white" to="/development/tulumers">Tulumers <span class="color-yellow">[Travel]</span></router-link></li>
        <li><router-link target="_blank" class="color-white" to="/development/luxji">Luxury Jewelry Imports <span class="color-yellow">[Retail]</span></router-link></li>
        <li><router-link class="color-white" to="/design/visualization/gravityAppleTree">Gravity Apple Tree <span class="color-yellow">[UAM-C]</span></router-link></li>
        <li><router-link class="color-white" to="/design/visualization/d3js">Go to <span class="color-yellow">[Vis]</span></router-link></li>
      </ul>
      <router-link class="color-red" to="/">[Back]</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Development',
  data(){
    return {
      mostrar: false,
    }
  },
  methods: {
    descubirSitios() {
      this.mostrar = !this.mostrar;
    }
  }
}
</script>

<style lang="scss" scoped>
.color-white {
  color: #fff;
  text-decoration: none;
  &:hover {
    font-weight: 900;
  }
}
</style>