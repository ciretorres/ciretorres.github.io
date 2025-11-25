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
        check my code on
        <a
          href="https://github.com/ciretorres/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github</a
        >, or view
        <a
          href="https://dev.qwer.mx/CV_EricTorres(english).pdf"
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
