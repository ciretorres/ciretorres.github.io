<template>
  <div class="development">
    <div class="container p-3">
      <p class="color-red">[Web development]</p>
      <ul>
        <li>
          Luxury Jewelry Imports <router-link class="color-yellow" to="/je">[Retail]</router-link>
        </li>
        <li>
          Centro Óptico Profesional <router-link class="color-yellow" to="/je">[Retail]</router-link>
        </li>
        <li>
          Expediciones Trotamundos <router-link class="color-yellow" to="/je">[Travel]</router-link>
        </li>
        <li>
          Tulumers <router-link class="color-yellow" to="/je">[Travel]</router-link>
        </li>
      </ul>
      <router-link class="color-red" to="/">[Back]</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Development',
}
</script>

<style lang="scss" scoped>
</style>