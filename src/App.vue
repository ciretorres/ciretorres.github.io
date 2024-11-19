<template>
  <div class="p-3">
    <header>
      <nav aria-label="Principal">
        <router-link to="/"
          ><h1>Alo! My name is Eric. Viszualization developer</h1></router-link
        >
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
        Let's chat on
        <a
          href="//api.whatsapp.com/send?phone=5547904238"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp</a
        >, check my code on
        <a
          href="https://github.com/ciretorres/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github</a
        >
        or view
        <a
          href="https://xd.adobe.com/view/6e6a30c0-f541-4cab-a5bb-1e817c9cec5c-3b39/?fullscreen"
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
