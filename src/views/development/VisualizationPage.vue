<script setup>
import { ref } from 'vue'

const menu_abierto = ref(false)
</script>

<template>
  <div class="visualization">
    <div class="flex">
      <div class="columna-4 columna-1-mov menu-fondo">
        <nav
          aria-label="Menú secundario"
          class="menu-lateral-contenedor"
        >
          <div
            class="menu-mov"
            @click="menu_abierto = !menu_abierto"
            :class="{ abierto: menu_abierto }"
          >
            <button
              :aria-expanded="menu_abierto ? 'true' : 'false'"
              class="boton-icono boton-menu"
            >
              <span class="icon-external-link"></span>
              <!-- <span
                v-if="menu_abierto"
                class="icono-angulo-doble-izquierda"
                aria-hidden="true"
              ></span>
              <span v-else class="icono-angulo-doble-derecha" aria-hidden="true"></span> -->
            </button>
          </div>
          <div
            id="snna7yrj3uh"
            class="menu-colapsable"
            :class="{ abierto: menu_abierto }"
          >
            <div class="menu-max-height">
              <ul>
                <li>
                  <router-link
                    class="nav-boton"
                    to="/development/visualization/intro"
                    ><h2>Visz</h2></router-link
                  >
                </li>
                <li>
                  <router-link
                    class="nav-boton"
                    to="/development/visualization/d3js"
                    >d3JS</router-link
                  >
                  <ul>
                    <li>
                      <router-link
                        class="nav-boton ml-5"
                        to="/development/visualization/d3js"
                        >Heatmap</router-link
                      >
                    </li>
                    <li>
                      <router-link
                        class="nav-boton ml-5"
                        to="/development/visualization/multiline"
                        >Multiline</router-link
                      >
                    </li>
                    <li>
                      <router-link
                        class="nav-boton ml-5"
                        to="/development/visualization/area"
                        >Area</router-link
                      >
                    </li>
                  </ul>
                </li>
                <li>
                  <router-link
                    class="nav-boton"
                    to="/development/visualization/maps"
                    >Maps</router-link
                  >
                </li>
                <li>
                  <a
                    class="nav-boton"
                    href="https://github.com/ciretorres/thesis-project"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Interactive-Interface
                    <span class="color-yellow">[UAM-A]</span></a
                  >
                </li>
                <li>
                  <a
                    class="nav-boton"
                    href="https://ciretorres.github.io/flujo-de-residuos-solidos-cdmx/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Solid Waste System's Interactive
                    <span class="color-yellow">[CDMX]</span></a
                  >
                </li>
                <li>
                  <a
                    class="nav-boton"
                    href="https://ciretorres.github.io/AR-System-UNIVERSUM/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >AR-System UNIVERSUM
                    <span class="color-yellow">[UIC]</span></a
                  >
                </li>
                <li>
                  <a
                    class="nav-boton"
                    href="https://github.com/ciretorres/2HAWC"
                    target="_blank"
                    rel="noopener noreferrer"
                    >3D Gamma-Ray Catalogue
                    <span class="color-yellow">[HAWC Observatory]</span></a
                  >
                </li>
                <li>
                  <router-link
                    class="nav-boton"
                    to="/development/visualization/gravity-apple-tree"
                    >The Gravity Apple Tree
                    <span class="color-yellow">[UAM-C]</span></router-link
                  >
                </li>
                <br />
                <router-link
                  class="color-yellow"
                  to="/development"
                  >[Back]</router-link
                >
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <div class="columna-12 columna-7-mov rout">
        <router-view class="view" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.visualization {
  .rout {
    // position: relative;
    // width: 70%;
    // background: #fff;
    background: var(--background-color);
    color: #fff;
    // grid-area: rout;
  }
  // width: 100%;
  // height: auto;
  // height: calc(100vh - 51px);
  // height: calc(100vh);
  // height: calc(100vh - 100px);
  // display: flex;
  // flex-direction: column;
  // align-items: stretch;
  // flex-direction: row;
  //   display: grid;
  //   grid-template-areas:
  //     'nav-vis'
  //     'rout';
  //   @media (min-width: 768px) {
  //     // flex-direction: row;
  //     grid-template-areas: 'nav-vis rout';
  //   }
  //   .nav-vis {
  //     width: auto;
  //     padding: 6px;
  //     @media (min-width: 768px) {
  //       max-width: 270px;
  //       border-right: 1px solid rgba(255, 255, 255, 0.1);
  //     }
  //     // background: goldenrod;
  //     background: var(--container-background-color);
  //     border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  //     grid-area: nav-vis;
  //     .nav-boton {
  //       color: #fff;
  //       display: block;
  //       padding: 8px;
  //       text-decoration: none;
  //       &:hover {
  //         font-weight: 900;
  //       }
  //     }
  //   }
  //   .rout {
  //     // position: relative;
  //     // width: 70%;
  //     // background: #fff;
  //     background: var(--background-color);
  //     color: #fff;
  //     grid-area: rout;
  //   }
}
</style>
