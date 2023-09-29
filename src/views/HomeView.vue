<script setup>
import { onMounted, ref } from 'vue'

const period = ref('')

onMounted(() => {
  setInterval(() => {
    if (period.value === '.....') {
      period.value = ''
    } else {
      period.value = period.value + '.'
    }
  }, 1000)
})
</script>

<template>
  <main
    id="principal"
    class="inicio"
  >
    <div class="container p-2">
      <p>
        Hello! My name is <span class="color-blue">Eric</span>. Visualization
        designer
      </p>
      <p>
        I'm interested in art, data & systems to build better things for this
        freak world.
      </p>
      <p>
        Currently, I'm learning about
        <span class="color-red">[machine learning & videogames]</span>
        in the beautiful
        <a
          href="https://goo.gl/ba2zp3"
          target="_blank"
          class="color-red"
        >
          México City<span class="icon icon-external-link"></span>
        </a>
        looking for new challengues!
      </p>
      <p>
        Some of my <span class="color-blue">recent personal proyects:</span>
      </p>
      <ul>
        <li>
          Developer
          <ul>
            <li>
              <a
                class="color-yellow"
                href="https://itch.io/profile/ciretorres"
                target="_blank"
                rel="noopener noreferrer"
                >[ Videogames ]</a
              >
            </li>
            <li>
              <router-link
                class="color-yellow"
                to="/development"
                >[ Other stuff{{ period }} ]</router-link
              >
            </li>
          </ul>
        </li>
        <br />
        <li>
          Communication
          <ul>
            <li>
              <router-link
                class="color-yellow"
                to="/design"
                >[ Marketing & Design ]</router-link
              >
            </li>
          </ul>
        </li>
      </ul>
      <p>
        Let's chat ->
        <a
          class="color-red"
          href="//api.whatsapp.com/send?phone=5547904238"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp<span class="icon icon-whatsapp"></span>
        </a>
      </p>
      <p>
        Or check my code ->
        <a
          class="color-red"
          href="https://github.com/ciretorres/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github<span class="icon icon-github"></span>
        </a>
      </p>
      <p>
        CV ->
        <a
          class="color-red"
          href="https://xd.adobe.com/view/6e6a30c0-f541-4cab-a5bb-1e817c9cec5c-3b39/?fullscreen"
          target="_blank"
          rel="noopener noreferrer"
        >
          CurriculumVitae
        </a>
      </p>
    </div>
  </main>
</template>
