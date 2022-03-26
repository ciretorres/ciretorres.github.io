<template>
  <div class="marketing">
    <div class="container" style="padding:40px;">
      <p style="color:#d33682;font-weight:bolder;">[Social Media Marketing]</p>
      <ul>
        <li>OXXO México <router-link style="color:#fcffd0;font-weight:bolder;" to="/je">[Clic me!]</router-link></li>      
        <li>Circuito Exterior Mexiquense <router-link style="color:#fcffd0;font-weight:bolder;" to="/je">[No over here]</router-link></li>
        <li>Bibiki <router-link style="color:#fcffd0;font-weight:bolder;" to="/je">[hellou!]</router-link></li>
        <li>Loreto Fish <router-link style="color:#fcffd0;font-weight:bolder;" to="/je">[yei]</router-link></li>
      </ul>
      <router-link style="color:#d33682;font-weight:bolder;" to="/">[Back]</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Marketing',
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