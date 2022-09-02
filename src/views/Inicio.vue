<template>
  <div class="inicio">
    <div class="container p-2">
      <!-- {{ msg }} -->
      <p>
        Hello! My name is <span class="color-blue">Eric</span>. 
        Visualization designer
      </p>
      <p>
        I'm interested in art, data & systems to build better things for this
        freak world.
      </p>
      <p>
        Currently, I'm working on my
        <span class="color-red">[Master Degree's Information Design & Visualization]</span>
        in the beautiful
        <a
          href="https://goo.gl/ba2zp3"
          target="_blank"
          class="color-red"
          >
          México City<span class="icon icon-external-link"></span>
        </a>
        looking for new challengues.
      </p>
      <p>
        Some of my <span class="color-blue">recent personal proyects!</span>
      </p>
      <ul>
        <li>Visualization <router-link class="color-yellow" to="/design">[Design]</router-link></li>
        <li>Web <router-link class="color-yellow" to="/development">[Development]</router-link></li>
        <li>Social <router-link class="color-yellow" to="/marketing">[Marketing]</router-link></li>
      </ul>
      <p>
        Let's chat -> 
        <a 
          href="//api.whatsapp.com/send?phone=5547904238" 
          class="color-red"
          >
          WhatsApp<span class="icon icon-whatsapp"></span>
        </a>
      </p>
      <p>
        Or check my code -> 
        <a 
          href="https://github.com/ciretorres/" 
          target="_blank" 
          class="color-red"
          >
          Github<span class="icon icon-github"></span>
        </a>
      </p>
      <p>
        CV -> 
        <a 
          href="https://xd.adobe.com/view/6e6a30c0-f541-4cab-a5bb-1e817c9cec5c-3b39/?fullscreen" 
          target="_blank" 
          class="color-red"
          >
          CurriculumVitae
        </a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Inicio",
  props: {
    msg: String,
  },
};
</script>

<style lang="scss" scoped>
</style>
