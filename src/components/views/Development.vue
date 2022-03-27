<template>
  <div class="development">
    <div class="container" style="padding:40px;">
      <p style="color:#d33682;font-weight:bolder;">[Web development]</p>
      <ul>
        <li>Luxury Jewelry Imports <router-link style="color:#fcffd0;font-weight:bolder;" to="/je">[Retail]</router-link></li>      
        <li>Centro Óptico Profesional <router-link style="color:#fcffd0;font-weight:bolder;" to="/je">[Retail]</router-link></li>
        <li>Expediciones Trotamundos <router-link style="color:#fcffd0;font-weight:bolder;" to="/je">[Travel]</router-link></li>
        <li>Tulumers <router-link style="color:#fcffd0;font-weight:bolder;" to="/je">[Travel]</router-link></li>
      </ul>
      <router-link style="color:#d33682;font-weight:bolder;" to="/">[Back]</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Development',
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