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
      <p>
        Currently, I'm learning about algorithms & videogames in the beautiful
        <a
          href="https://goo.gl/ba2zp3"
          target="_blank"
          rel="noopener noreferrer"
        >
          México City</a
        >
        looking for new challengues!
      </p>
    </section>

    <section
      id="proyectos"
      aria-label="Proyectos"
    >
      <h2>These are some of my recent personal proyects:</h2>

      <nav aria-label="Secundaria proyectos">
        <ul>
          <li>
            <a
              href="https://itch.io/profile/ciretorres"
              target="_blank"
              rel="noopener noreferrer"
              >[ Videogames ]</a
            >
          </li>
          <li>
            <router-link to="/web-development">[ Web Frontend ]</router-link>
          </li>
          <li>
            <router-link to="/visualization/intro"
              >[ Visualization ]</router-link
            >
          </li>
        </ul>
      </nav>
    </section>
  </article>
</template>
