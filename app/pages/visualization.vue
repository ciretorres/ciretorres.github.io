<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <div>
    <header>
      <nuxt-link to="/visualization"><h2>VVVViszualization</h2></nuxt-link>
    </header>

    <div class="container">
      <AsideMenu />

      <section
        id="content"
        aria-label="contenido"
      >
        <NuxtPage />
      </section>
    </div>

    <br>
    <nuxt-link to="/">[Go back]</nuxt-link>
  </div>
</template>
