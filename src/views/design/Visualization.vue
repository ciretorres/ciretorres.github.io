<template>
  <div class="visualization">    
    <div class="nav-vis">
      <div class="ml-3">
        <h1>Vis</h1>
        <ul>
          <li><router-link class="nav-boton" to="/design/visualization/d3js">d3JS</router-link></li>
          <li><router-link class="nav-boton" to="/design/visualization/maps">maps</router-link></li>
          <li>Interactive-Interface <a href="https://github.com/ciretorres/thesis-project" target="_blank" class="color-yellow">[UAM-A]</a></li>
          <li> <a href="https://ciretorres.github.io/AR-System-UNIVERSUM/" target="_blank" class="nav-boton">AR-System UNIVERSUM <span class="color-yellow">[ UIC ]</span></a></li>
          <li><a href="https://ciretorres.github.io/flujo-de-residuos-solidos-cdmx/" target="_blank" class="nav-boton">Solid Waste System's Interactive <span class="color-yellow">[ CDMX ]</span></a></li>
          <li><a href="https://github.com/ciretorres/2HAWC" target="_blank" class="nav-boton">3D Gamma-Ray Catalogue <span class="color-yellow">[ HAWC Observatory]</span></a></li>
          <li><router-link class="nav-boton" to="/design/visualization/gravityAppleTree">Gravity Apple Tree <span class="color-yellow">[ UAM-C ]</span></router-link></li>          
        </ul>
        <router-link class="color-yellow" to="/">[Back]</router-link>
      </div>
      
    </div>
    <div class="rout">
      <router-view class="view" />
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'Visualization',
}
</script>

<style lang="scss" scoped>
.visualization {
  // width: 100%;
  // height: auto;
  // height: calc(100vh - 51px);
  // height: calc(100vh);
  // height: calc(100vh - 100px);
  // display: flex;
  // flex-direction: column;
  // align-items: stretch;
  // flex-direction: row;
  display: grid;
  grid-template-areas: 
    "nav-vis"
    "rout";
  @media (min-width:768px) {
    // flex-direction: row;
    grid-template-areas: "nav-vis rout";
  }
  .nav-vis {
    width: auto;
    padding: 6px;
    @media (min-width:768px) {
      width: 275px;
    }
    background: goldenrod;
    grid-area: nav-vis;
  }
  .rout {
    // position: relative;
    // width: 70%;
    background: #fff;
    color: #000;
    grid-area: rout;
  }
}
</style>