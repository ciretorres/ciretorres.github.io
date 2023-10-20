<template>
  <main id="principal" class="tulumers">
    <a class="portafolio" href="https://tulumers.com/" target="_blank" rel="noopener noreferrer">
      <img
        class="img-portafolio"
        src="@/assets/imgs/portafolio-tulumers-1.webp"
        loading="lazy"
        alt=""
      />
      <img
        class="img-portafolio"
        src="@/assets/imgs/portafolio-tulumers-2.webp"
        loading="lazy"
        alt=""
      />
      <img
        class="img-portafolio"
        src="@/assets/imgs/portafolio-tulumers-3.webp"
        loading="lazy"
        alt=""
      />
    </a>

    <div class="navegacion">
      <router-link class="nav-boton" to="/design/expediciones-trotamundos">[previous]</router-link>
      <router-link class="nav-boton" to="/design/luxji">[next]</router-link>
    </div>
    <div class="contenedor pb-5">
      <router-link class="color-red" to="/design">[Back]</router-link>
    </div>
  </main>
</template>
