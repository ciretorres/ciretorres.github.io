<script setup>
const public_path = import.meta.env.BASE_URL
</script>

<template>
  <main id="principal" class="circuito-exterior-mexiquense">
    <div class="portafolio">
      <img
        class="img-portafolio"
        :src="`${public_path}imgs/header-cem.webp`"
        loading="lazy"
        alt=""
      />
      <div class="container contenido">
        <div class="contenedor-link">
          <a
            class="logo-link"
            href="https://www.circuitoexterior.mx/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img class="logo-img" :src="`${public_path}imgs/logo-cem.webp`" loading="lazy" alt="" />
          </a>
        </div>

        <div class="navegacion">
          <router-link class="nav-boton" to="/design/oxxo">[previous]</router-link>
          <router-link class="nav-boton" to="/design/bibiki">[next]</router-link>
        </div>

        <div class="redes-sociales">
          <div class="flexbox">
            <a
              href="https://www.facebook.com/ElCircuito.Mx/"
              target="_blank"
              rel="noopener noreferrer"
              ><span class="icon bg-darkblue icon-facebook"></span
            ></a>
            <a href="https://twitter.com/Circuito_mx" target="_blank" rel="noopener noreferrer"
              ><span class="icon bg-darkblue icon-twitter"></span
            ></a>
            <a
              href="https://www.youtube.com/user/CircuitoMx"
              target="_blank"
              rel="noopener noreferrer"
              ><span class="icon bg-darkblue icon-youtube-alt"></span
            ></a>
          </div>
        </div>

        <div class="posts">
          <video class="post-img" autoplay muted loop playsinline>
            <source :src="`${public_path}imgs/post-cem-1.webm`" type="video/webm" />
          </video>
          <img class="post-img" :src="`${public_path}imgs/post-cem-2.webp`" loading="lazy" alt="" />
          <img class="post-img" :src="`${public_path}imgs/post-cem-3.webp`" loading="lazy" alt="" />
          <img class="post-img" :src="`${public_path}imgs/post-cem-4.webp`" loading="lazy" alt="" />
          <iframe
            class="post-video"
            src="https://www.youtube.com/embed/iGNKk7rRcsU"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          >
          </iframe>
        </div>

        <div class="navegacion my-8">
          <router-link class="nav-boton" to="/design/oxxo">[previous]</router-link>
          <router-link class="nav-boton" to="/design/bibiki">[next]</router-link>
        </div>
        <router-link class="color-red pb-5" to="/design">[Back]</router-link>
      </div>
    </div>
  </main>
</template>
