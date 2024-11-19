<script setup></script>
<template>
  <div>
    <div class="container">
      <aside aria-label="Barra lateral">
        <nav aria-label="Secundaria Viszualization">
          <header>
            <router-link to="/visualization/intro"
              ><h2>Viszualization</h2></router-link
            >
          </header>

          <div
            class="group"
            tabindex="0"
          >
            <section
              id="d3js"
              aria-label="d3js"
            >
              <ul>
                <li>
                  <router-link to="/visualization/d3js">Heatmap</router-link>
                </li>
                <li>
                  <router-link to="/visualization/multiline"
                    >Multiline</router-link
                  >
                </li>
                <li>
                  <router-link to="/visualization/area">Area</router-link>
                </li>
                <li>
                  <router-link to="/visualization/sankey"
                    >Flow diagram</router-link
                  >
                </li>
              </ul>
            </section>

            <section
              id="maps"
              aria-label="mapas"
            >
              <ul>
                <li>
                  +<router-link to="/visualization/maps">Maps</router-link>
                </li>
              </ul>
            </section>

            <section
              id="visualizations"
              aria-label="visualizations"
            >
              <ul>
                <li>
                  <a
                    href="https://github.com/ciretorres/thesis-project"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Thesis-project [UAM-A]</a
                  >
                </li>
                <li>
                  <a
                    href="https://ciretorres.github.io/flujo-de-residuos-solidos-cdmx/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Interactive Solid Waste System [CDMX]</a
                  >
                </li>
                <li>
                  <a
                    href="https://ciretorres.github.io/AR-System-UNIVERSUM/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >AR-System UNIVERSUM [UIC]</a
                  >
                </li>
                <li>
                  <a
                    href="https://github.com/ciretorres/2HAWC"
                    target="_blank"
                    rel="noopener noreferrer"
                    >3D Gamma-Ray-Catalogue [HAWC Observatory]</a
                  >
                </li>
              </ul>
            </section>
          </div>
        </nav>
      </aside>

      <section
        id="content"
        aria-label="contenido"
      >
        <router-view />
      </section>
    </div>

    <br />
    <router-link to="/">[Go back]</router-link>
  </div>
</template>

<style lang="scss"></style>
