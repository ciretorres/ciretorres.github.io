<script setup>
const public_path = process.env.BASE_URL
</script>

<template>
  <main
    id="principal"
    class="expediciones-trotamundos"
  >
    <a
      class="portafolio"
      href="http://etrotamundos.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        class="img-portafolio"
        :src="`${public_path}imgs/portafolio-etrota-1.webp`"
        loading="lazy"
        alt=""
      />
      <img
        class="img-portafolio"
        :src="`${public_path}imgs/portafolio-etrota-2.webp`"
        loading="lazy"
        alt=""
      />
      <img
        class="img-portafolio"
        :src="`${public_path}imgs/portafolio-etrota-3.webp`"
        loading="lazy"
        alt=""
      />
    </a>

    <div class="navegacion">
      <router-link
        class="nav-boton"
        to="/design/centro-optico-profesional"
        >[previous]</router-link
      >
      <router-link
        class="nav-boton"
        to="/design/tulumers"
        >[next]</router-link
      >
    </div>
    <div class="contenedor pb-5">
      <router-link
        class="color-red"
        to="/design"
        >[Back]</router-link
      >
    </div>
  </main>
</template>
