<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <article>
    <section
      id="intro"
      aria-label="Introducción"
    >
      <h2>
        I'm interested in art, data & systems to build better things for this
        freak world.
      </h2>
    </section>

    <section
      id="proyectos"
      aria-label="Proyectos"
    >
      <h2>recent projects:</h2>

      <nav aria-label="Secundaria proyectos">
        <ul>
          <li>
            <a
              href="https://itch.io/profile/ciretorres"
              target="_blank"
              rel="noopener noreferrer"
            >[ videogames ]</a>
          </li>
          <li>
            <nuxt-link to="/web-development">[ web frontend ]</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/visualization/sankey-diagram">[ visualization ]</nuxt-link>
          </li>
        </ul>
      </nav>
    </section>
  </article>
</template>
