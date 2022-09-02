<template>
  <div class="design">
    <div class="container p-2">
      <p class="color-red">[Visualization Design]</p>
      <ul>
        <li>Interactive-Interface <a href="https://github.com/ciretorres/thesis-project" target="_blank" class="color-yellow">[UAM-A]</a></li>
        <li>AR-System UNIVERSUM <a href="https://ciretorres.github.io/AR-System-UNIVERSUM/" target="_blank" class="color-yellow">[UIC]</a></li>
        <li>Solid Waste System's Interactive <a href="https://ciretorres.github.io/flujo-de-residuos-solidos-cdmx/" target="_blank" class="color-yellow">[CDMX]</a></li>
        <li>3D Gamma-Ray Catalogue <a href="https://github.com/ciretorres/2HAWC" target="_blank" class="color-yellow">[HAWC Observatory]</a></li>
        <!-- <li>The Gravity Apple Tree <a href="@/assets/imgs/2018-11-07-gravity-apple-tree.jpg" target="_blank" class="color-yellow">[UAM-C]</a></li> -->
        <!-- <li>The Gravity Apple Tree <a href="imgs/2018-11-07-gravity-apple-tree.jpg" target="_blank" class="color-yellow">[UAM-C]</a></li> -->
        <li>The Gravity Apple Tree <a :href="`${public_path}imgs/2018-11-07-gravity-apple-tree.jpg`" target="_blank" class="color-yellow">[UAM-C]</a></li>
        <li>Go to <router-link class="color-yellow" target="_blank" to="/visualization">[Vis]</router-link></li>
      </ul>
      <router-link class="color-red" to="/">[Back]</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Design',
  data() {
    return {
      public_path: process.env.BASE_URL
    }
  }
}
</script>

<style lang="scss" scoped>
</style>