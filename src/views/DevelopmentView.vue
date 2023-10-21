<script setup>
import { ref } from 'vue';

const mostrar = ref(true)
</script>

<template>
  <main
    id="principal"
    class="development"
  >
    <div class="container p-2">
      <p class="color-red">[Other stuff...]</p>
      <ul>
        <li>
          <a
            @click="mostrar = !mostrar"
            style="cursor: pointer"
            class="color-white"
            rel="noopener noreferrer"
          >
            Web Frontend <span class="color-yellow">[Conahcyt]</span></a
          >
        </li>
        <ul v-show="mostrar">
          <li>
            <a
              href="https://eni.conacyt.mx/"
              class="color-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ecosistemas Nacionales Informáticos</a
            >
          </li>
          <ul>
            <li>
              <a
                href="https://salud.conacyt.mx/"
                class="color-white"
                target="_blank"
                rel="noopener noreferrer"
                >Salud</a
              >
            </li>
            <ul>
              <li>
                <a
                  href="https://salud.conacyt.mx/vih/"
                  class="color-white"
                  target="_blank"
                  rel="noopener noreferrer"
                  >VIH</a
                >
              </li>
              <li>
                <a
                  href="https://salud.conacyt.mx/coronavirus/"
                  class="color-white"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Coronavirus</a
                >
              </li>
              <ul>
                <li>
                  <a
                    href="https://salud.conacyt.mx/coronavirus/variantes/"
                    class="color-white"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Variantes</a
                  >
                </li>
                <li>
                  <a
                    href="https://salud.conacyt.mx/coronavirus/vacunacion/"
                    class="color-white"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Vacunacion</a
                  >
                </li>
                <li>
                  <a
                    class="color-white"
                    href="https://salud.conahcyt.mx/coronavirus/investigacion/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Investigacion</a
                  >
                </li>
              </ul>
            </ul>
          </ul>
          <ul>
            <li>
              <a
                href="https://alimentacion.conacyt.mx/"
                class="color-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Soberanía alimentaria</a
              >
            </li>
            <ul>
              <li>
                <a
                  href="https://alimentacion.conacyt.mx/glifosato/"
                  class="color-white"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Glifosato</a
                >
              </li>
              <li>
                <a
                  href="https://alimentacion.conacyt.mx/piesagiles/"
                  class="color-white"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Pies ágiles</a
                >
              </li>
            </ul>
          </ul>
          <ul>
            <li>Socioecología</li>
            <ul>
              <li>
                <a
                  href="https://socioecologia.conacyt.mx/texcoco/"
                  class="color-white"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Texcoco</a
                >
              </li>
            </ul>
          </ul>
          <ul>
            <li>
              <a
                href="https://energia.conacyt.mx/"
                class="color-white"
                target="_blank"
                rel="noopener noreferrer"
                >Energía y cambio climático</a
              >
            </li>
            <ul>
              <li>
                <a
                  href="https://energia.conacyt.mx/sargazo/"
                  class="color-white"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Sargazo</a
                >
              </li>
              <li>
                <a
                  href="https://energia.conacyt.mx/planeas/"
                  class="color-white"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Planeas</a
                >
              </li>
            </ul>
          </ul>
          <ul>
            <li>
              <a
                class="color-white"
                href="https://agua.conahcyt.mx/"
                target="_blank"
                rel="noopener noreferrer"
                >Agua</a
              >
            </li>
            <ul>
              <li>
                <a
                  href="https://agua.conacyt.mx/cuencas/"
                  class="color-white"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Cuencas</a
                >
              </li>
            </ul>
          </ul>
          <ul>
            <li>
              <a
                class="color-white"
                href="https://toxicologia.conacyt.mx/"
                target="_blank"
                rel="noopener noreferrer"
                >Agentes Tóxicos y Procesos Contaminantes</a
              >
            </li>
            <ul>
              <li>
                <a
                  class="color-white"
                  href="https://toxicologia.conahcyt.mx/resa-atoyac/"
                  target="_blank"
                  rel="noopener noreferrer"
                  >RESA: Cuenca del alto Atoyac</a
                >
              </li>
            </ul>
          </ul>
        </ul>
        <li>
          <router-link
            class="color-white"
            to="/development/visualization/intro"
          >
            Go to <span class="color-yellow">[Visualization]</span></router-link
          >
        </li>
      </ul>
      <router-link
        class="color-red"
        to="/"
        >[Back]</router-link
      >
    </div>
  </main>
</template>
