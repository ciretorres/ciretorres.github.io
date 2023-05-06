<template>
  <div>
    <img class="gravity-apple-tree" :src="`${public_path}imgs/2018-11-07-gravity-apple-tree.jpg`" alt="gravityAppleTree">
  </div>
</template>

<script>
export default {
  name: 'GravityAppleTree',
  data() {
    return {
      public_path: process.env.BASE_URL
    }
  }
}
</script>

<style>
.gravity-apple-tree {
  max-width: 100%;
}
</style>