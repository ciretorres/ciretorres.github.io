<template>
  <main id="principal" class="loreto-fish">
    <div class="portafolio">
      <img
        class="img-portafolio"
        src="@/assets/imgs/header-loreto-fish.webp"
        loading="lazy"
        alt=""
      />
      <div class="container contenido">
        <div class="contenedor-link">
          <a
            class="logo-link"
            href="https://www.loretofish.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img class="logo-img" src="@/assets/imgs/logo-loreto-fish.webp" loading="lazy" alt="" />
          </a>
        </div>

        <div class="navegacion">
          <router-link class="nav-boton" to="/design/bibiki">[previous]</router-link>
          <router-link class="nav-boton" to="/design/oxxo">[next]</router-link>
        </div>

        <div class="redes-sociales">
          <div class="flexbox">
            <a href="https://www.facebook.com/loretofish/" target="_blank" rel="noopener noreferrer"
              ><span class="icon bg-lightseagreen icon-facebook"></span
            ></a>
            <a href="https://twitter.com/loretofish_" target="_blank" rel="noopener noreferrer"
              ><span class="icon bg-lightseagreen icon-twitter"></span
            ></a>
            <a
              href="https://www.instagram.com/loretofish/"
              target="_blank"
              rel="noopener noreferrer"
              ><span class="icon bg-lightseagreen icon-instagrem"></span
            ></a>
          </div>
        </div>

        <div class="posts">
          <img class="post-img" src="@/assets/imgs/post-loreto-fish-1.webp" loading="lazy" alt="" />
        </div>

        <div class="navegacion my-8">
          <router-link class="nav-boton" to="/design/bibiki">[previous]</router-link>
          <router-link class="nav-boton" to="/design/oxxo">[next]</router-link>
        </div>
        <router-link class="color-red pb-5" to="/design">[Back]</router-link>
      </div>
    </div>
  </main>
</template>
