<template>
  <div class="visualization">    
    <div class="nav-vis">
      <div class="ml-3">
        <h1>Visz</h1>
        <router-link 
        class="nav-boton" 
        to="/design/visualization/d3js">d3JS</router-link>
        <router-link 
        class="nav-boton" 
        to="/design/visualization/maps">maps</router-link>
        <a 
        href="https://github.com/ciretorres/thesis-project" 
        class="nav-boton" 
        target="_blank">Interactive-Interface <span class="color-yellow">[UAM-A]</span></a>
        <a 
        href="https://ciretorres.github.io/flujo-de-residuos-solidos-cdmx/" 
        target="_blank" 
        class="nav-boton">Solid Waste System's Interactive <span class="color-yellow">[CDMX]</span></a>
        <a 
        href="https://ciretorres.github.io/AR-System-UNIVERSUM/" 
        target="_blank" 
        class="nav-boton">AR-System UNIVERSUM <span class="color-yellow">[UIC]</span></a>
        <a 
        href="https://github.com/ciretorres/2HAWC" 
        target="_blank" 
        class="nav-boton">3D Gamma-Ray Catalogue <span class="color-yellow">[HAWC Observatory]</span></a>
        
        <br />
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
      max-width: 270px;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
    }
    // background: goldenrod;
    background: var(--container-background-color);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    grid-area: nav-vis;
    ;
    .nav-boton {
      color: #fff;
      display: block;
      padding: 8px;
      text-decoration: none;
      &:hover {
        font-weight: 900;
      }
    }
  }
  .rout {
    // position: relative;
    // width: 70%;
    // background: #fff;
    background: var(--background-color);
    color: #fff;
    grid-area: rout;
  }
}
</style>