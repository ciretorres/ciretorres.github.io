<script setup>
const public_path = import.meta.env.BASE_URL
</script>

<template>
  <div class="gravity-apple-tree">
    <div class="container sin-fondo">
      <h1>Gravity Apple Tree</h1>
      <a href="/imgs/2018-11-07-gravity-apple-tree.webp" target="_blank" rel="noopener noreferrer">
        <img
          style="width: 100%"
          :src="`${public_path}imgs/2018-11-07-gravity-apple-tree.webp`"
          loading="lazy"
          alt="Gravity Apple Tree"
        />
      </a>
    </div>
  </div>
</template>
