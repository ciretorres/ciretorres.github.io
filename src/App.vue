<template>
  <div class="p-3">
    <header>
      <nav aria-label="Principal">
        <router-link to="/"> <h1>I'm Eric. web developer</h1></router-link>
      </nav>
    </header>

    <main id="principal">
      <RouterView />
    </main>

    <section
      id="contacto"
      aria-label="Contacto"
    >
      <h2>
        Code
        <a
          href="https://github.com/ciretorres/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github</a
        >,
        <a
          href="https://raw.githubusercontent.com/ciretorres/ciretorres.github.io/refs/heads/develop/src/assets/docs/CV_EricTorres(english)_compressed.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          CurriculumVitae</a
        >.
      </h2>
    </section>
  </div>
</template>

<style lang="scss">
@use '@/scss/app.scss';
</style>
