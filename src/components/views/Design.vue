<template>
  <div class="design">
    <div class="container" style="padding:40px;">
      <p style="color:#d33682;font-weight:bolder;">[Visualization Design]</p>
      <ul>
        <li>Interactive-Interface <router-link style="color:#fcffd0;font-weight:bolder;" to="/je">[UAM-A]</router-link></li>      
        <li>AR-System UNIVERSUM <router-link style="color:#fcffd0;font-weight:bolder;" to="/je">[UIC]</router-link></li>
        <li>Solid Waste System's Interactive <router-link style="color:#fcffd0;font-weight:bolder;" to="/je">[CDMX]</router-link></li>
        <li>3D Gamma-Ray Catalogue <router-link style="color:#fcffd0;font-weight:bolder;" to="/je">[HAWC Observatory]</router-link></li>
        <li>The Gravity Apple Tree <router-link style="color:#fcffd0;font-weight:bolder;" to="/je">[UAM-C]</router-link></li>
      </ul>
      <router-link style="color:#d33682;font-weight:bolder;" to="/">[Back]</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Design',
}
</script>

<style lang="scss" scoped>
.container {
  background: rgba($color: #fff, $alpha: 0.05);
  // width: calc(100% - #{$gap*2});
  width: calc(100% - 60px);
  // max-width: map-get($width, "max-view");
  max-width: 1024px;
  max-width: 800px;
  border: 1px solid rgba($color: #fff, $alpha: 0.1);
  border-radius: 8px;
  margin-left: auto;
  margin-right: auto;
}
</style>