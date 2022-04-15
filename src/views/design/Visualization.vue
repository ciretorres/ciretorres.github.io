<template>
  <div class="visualization">    
    <div class="nav-vis">
      <div class="ml-3">
        <h1>Vis</h1>
        <ul>
          <li><router-link class="nav-boton" to="/design/visualization/eje">d3JS</router-link></li>
          <li><router-link class="nav-boton" to="/design/visualization/eje">maps</router-link></li>
          <li>Interactive-Interface</li>
          <li>AR-System UNIVERSUM</li>
          <li>Solid Waste System's Interactive</li>
          <li>3D Gamma-Ray Catalogue</li>
          <li>The Gravity Apple Tree</li>
        </ul>
      </div>
    </div>
    <div class="rout">
      <!-- <p>Router</p> -->
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
  width: 100%;
  height: auto;
  // height: calc(100vh - 51px);
  // height: calc(100vh);
  // height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  // align-items: stretch;
    // flex-direction: row;
  @media (min-width:768px) {
    flex-direction: row;
  }
  .nav-vis {
    // width: 35%;
    background: goldenrod;
  }
  .rout {
    // position: relative;
    width: 100%;
    background: #fff;
    color: #000;
  }
}
</style>