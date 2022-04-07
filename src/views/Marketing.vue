<template>
  <div class="marketing">
    <div class="container p-3">
      <p class="color-red">[Social Media Marketing]</p>
      <ul>
        <li>OXXO México <router-link class="color-yellow" target="_blank" to="/marketing/oxxo">[Clic me!]</router-link></li>
        <li>Circuito Exterior Mexiquense <router-link class="color-yellow" target="_blank" to="/marketing/cem">[No over here]</router-link></li>
        <li>Bibiki <router-link class="color-yellow" target="_blank" to="/marketing/bibiki">[hellou!]</router-link></li>
        <li>Loreto Fish <router-link class="color-yellow" target="_blank" to="/marketing/loreto-fish">[yei]</router-link></li>
      </ul>
      <router-link class="color-red" to="/">[Back]</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Marketing',
}
</script>

<style lang="scss" scoped>
</style>