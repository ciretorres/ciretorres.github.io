<template>
  <main id="principal" class="bibiki">
    <div class="portafolio">
      <img class="img-portafolio" src="@/assets/imgs/header-bibiki.webp" loading="lazy" alt="" />
      <div class="container contenido">
        <div class="contenedor-link">
          <a
            class="logo-link"
            href="https://bibiki.myshopify.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img class="logo-img" src="@/assets/imgs/logo-bibiki.webp" loading="lazy" alt="" />
          </a>
        </div>

        <div class="navegacion">
          <router-link class="nav-boton" to="/design/circuito-exterior-mexiquense"
            >[previous]</router-link
          >
          <router-link class="nav-boton" to="/design/loreto-fish">[next]</router-link>
        </div>

        <div class="redes-sociales">
          <div class="flexbox">
            <a
              href="https://www.facebook.com/bibikimexico"
              target="_blank"
              rel="noopener noreferrer"
              ><span class="icon bg-lightskyblue icon-facebook"></span
            ></a>
            <a href="https://twitter.com/bibikimx" target="_blank" rel="noopener noreferrer"
              ><span class="icon bg-lightskyblue icon-twitter"></span
            ></a>
            <a href="https://www.instagram.com/bibikimx/" target="_blank" rel="noopener noreferrer"
              ><span class="icon bg-lightskyblue icon-instagrem"></span
            ></a>
          </div>
        </div>

        <div class="posts">
          <video class="post-img" autoplay muted loop playsinline>
            <source src="@/assets/imgs/post-bibiki-1.webm" type="video/webm" />
          </video>
          <video class="post-img" autoplay muted loop playsinline>
            <source src="@/assets/imgs/post-bibiki-2.webm" type="video/webm" />
          </video>
        </div>

        <div class="navegacion my-8">
          <router-link class="nav-boton" to="/design/circuito-exterior-mexiquense"
            >[previous]</router-link
          >
          <router-link class="nav-boton" to="/design/loreto-fish">[next]</router-link>
        </div>
        <router-link class="color-red pb-5" to="/design">[Back]</router-link>
      </div>
    </div>
  </main>
</template>
