<script setup></script>
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
              >[ videogames ]</a
            >
          </li>
          <li>
            <router-link to="/web-dev">[ web frontend ]</router-link>
          </li>
          <li>
            <router-link to="/visualization/sankey"
              >[ visualization ]</router-link
            >
          </li>
        </ul>
      </nav>
    </section>
  </article>
</template>
