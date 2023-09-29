<script setup>
import { onMounted, ref } from 'vue'

const salutation = ['[Clic me!]', '[No over here]', '[hellou!]', '[yei]']
const arrayMessage = ref({
  a: ' ',
  b: ' ',
  c: ' ',
  d: ' ',
  e: ' '
})

onMounted(() => {
  setInterval(() => {
    const r = ['a', 'b', 'c', 'd']
    let item = r[Math.floor(Math.random() * r.length)]
    arrayMessage.value = {
      a: '',
      b: '',
      c: '',
      d: ''
    }
    let choose = salutation[Math.floor(Math.random() * salutation.length)]
    arrayMessage.value[item] = choose
  }, 1000)
})
</script>

<template>
  <main id="principal" class="design">
    <div class="container p-2">
      <p class="color-red">[Marketing & Design]</p>
      <ul>
        <li>
          <router-link
            class="color-white"
            to="/design/luxji"
            target="_blank"
            rel="noopener noreferrer"
          >
            Luxury Jewelry Imports <span class="color-yellow">[Retail]</span></router-link
          >
        </li>
        <li>
          <router-link
            class="color-white"
            to="/design/centro-optico-profesional"
            target="_blank"
            rel="noopener noreferrer"
          >
            Centro Óptico Profesional <span class="color-yellow">[Retail]</span></router-link
          >
        </li>
        <li>
          <router-link
            class="color-white"
            to="/design/expediciones-trotamundos"
            target="_blank"
            rel="noopener noreferrer"
          >
            Expediciones Trotamundos <span class="color-yellow">[Travel]</span></router-link
          >
        </li>
        <li>
          <router-link
            class="color-white"
            to="/design/tulumers"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tulumers <span class="color-yellow">[Travel]</span></router-link
          >
        </li>
      </ul>

      <ul>
        <li>
          <router-link
            class="color-white"
            to="/design/oxxo"
            target="_blank"
            rel="noopener noreferrer"
          >
            OXXO México <span class="color-yellow">{{ arrayMessage.a }}</span></router-link
          >
        </li>
        <li>
          <router-link
            class="color-white"
            to="/design/cem"
            target="_blank"
            rel="noopener noreferrer"
          >
            Circuito Exterior Mexiquense
            <span class="color-yellow">{{ arrayMessage.b }}</span></router-link
          >
        </li>
        <li>
          <router-link
            class="color-white"
            to="/design/bibiki"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bibiki <span class="color-yellow">{{ arrayMessage.c }}</span></router-link
          >
        </li>
        <li>
          <router-link
            class="color-white"
            to="/design/loreto-fish"
            target="_blank"
            rel="noopener noreferrer"
          >
            Loreto Fish <span class="color-yellow">{{ arrayMessage.d }}</span></router-link
          >
        </li>
      </ul>

      <ul>
        <li>
          <router-link class="color-white" to="/design/visualization/d3js">
            Go to <span class="color-yellow">[Vis]</span></router-link
          >
        </li>
      </ul>
      <router-link class="color-red" to="/">[Back]</router-link>
    </div>
  </main>
</template>
