<script setup>
const public_path = process.env.BASE_URL
</script>

<template>
  <main
    id="principal"
    class="centro-optico-profesional"
  >
    <a
      class="portafolio"
      href="http://www.centroopticoprofesional.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        class="img-portafolio"
        :src="`${public_path}imgs/portafolio-cop-1.webp`"
        loading="lazy"
        alt=""
      />
      <img
        class="img-portafolio"
        :src="`${public_path}imgs/portafolio-cop-2.webp`"
        loading="lazy"
        alt=""
      />
      <img
        class="img-portafolio"
        :src="`${public_path}imgs/portafolio-cop-3.webp`"
        loading="lazy"
        alt=""
      />
    </a>

    <div class="navegacion">
      <router-link
        class="nav-boton"
        to="/design/luxji"
        >[previous]</router-link
      >
      <router-link
        class="nav-boton"
        to="/design/expediciones-trotamundos"
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
