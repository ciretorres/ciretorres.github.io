<template>
  <main
    id="principal"
    class="oxxo"
  >
    <div class="portafolio">
      <img
        class="img-portafolio"
        src="@/assets/imgs/header-oxxo.webp"
        loading="lazy"
        alt=""
      />
      <div class="container contenido">
        <div class="contenedor-link">
          <a
            class="logo-link"
            href="https://www.oxxo.com/"
            target="_blank"
            rel="noopener noreferrer"
            ><img
              class="logo-img"
              src="@/assets/imgs/logo-oxxo.webp"
              loading="lazy"
              alt=""
          /></a>
        </div>

        <div class="navegacion">
          <router-link
            class="nav-boton"
            to="/design/loreto-fish"
            >[previous]</router-link
          >
          <router-link
            class="nav-boton"
            to="/design/circuito-exterior-mexiquense"
            >[next]</router-link
          >
        </div>

        <div class="redes-sociales">
          <div class="flexbox">
            <a
              href="https://www.facebook.com/OXXOTiendas/"
              target="_blank"
              rel="noopener noreferrer"
              ><span class="icon bg-red icon-facebook"></span
            ></a>
            <a
              href="https://twitter.com/Tiendas_OXXO"
              target="_blank"
              rel="noopener noreferrer"
              ><span class="icon bg-red icon-twitter"></span
            ></a>
            <a
              href="https://www.instagram.com/tiendasoxxo/"
              target="_blank"
              rel="noopener noreferrer"
              ><span class="icon bg-red icon-instagrem"></span
            ></a>
          </div>
        </div>

        <div class="posts">
          <video
            class="post-img"
            autoplay
            muted
            loop
            playsinline
          >
            <source
              src="@/assets/imgs/post-oxxo-1.webm"
              type="video/webm"
            />
          </video>
          <video
            class="post-img"
            autoplay
            muted
            loop
            playsinline
          >
            <source
              src="@/assets/imgs/post-oxxo-2.webm"
              type="video/webm"
            />
          </video>
          <video
            class="post-img"
            autoplay
            muted
            loop
            playsinline
          >
            <source
              src="@/assets/imgs/post-oxxo-3.webm"
              type="video/webm"
            />
          </video>
          <video
            class="post-img"
            autoplay
            muted
            loop
            playsinline
          >
            <source
              src="@/assets/imgs/post-oxxo-4.webm"
              type="video/webm"
            />
          </video>
        </div>

        <div class="navegacion my-8">
          <router-link
            class="nav-boton"
            to="/design/loreto-fish"
            >[previous]</router-link
          >
          <router-link
            class="nav-boton"
            to="/design/circuito-exterior-mexiquense"
            >[next]</router-link
          >
        </div>
        <router-link
          class="color-red pb-5"
          to="/design"
          >[Back]</router-link
        >
      </div>
    </div>
  </main>
</template>
