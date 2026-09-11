<template>
  <aside aria-label="Barra lateral">
    <nav aria-label="Secundaria Viszualization">
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
              <nuxt-link to="/visualization/sankey-diagram">Flow diagram</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/visualization/heatmap-diagram">Heatmap</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/visualization/multiline-diagram">Multiline</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/visualization/area-diagram">Area</nuxt-link>
            </li>
          </ul>
        </section>

        <section
          id="maps"
          aria-label="mapas"
        >
          <ul>
            <li>
              +<nuxt-link to="/visualization/maps">Maps</nuxt-link>
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
              >Thesis-project [UAM-A]</a>
              <!-- <router-link to="/visualization/thesis-project">Thesis-project [UAM-A]
              </router-link> -->
            </li>
            <li>
              <a
                href="https://ciretorres.github.io/flujo-de-residuos-solidos-cdmx/"
                target="_blank"
                rel="noopener noreferrer"
              >Interactive Solid Waste System [CDMX]</a>
            </li>
            <li>
              <a
                href="https://ciretorres.github.io/AR-System-UNIVERSUM/"
                target="_blank"
                rel="noopener noreferrer"
              >AR-System UNIVERSUM [UIC]</a>
            </li>
            <li>
              <a
                href="https://github.com/ciretorres/2HAWC"
                target="_blank"
                rel="noopener noreferrer"
              >3D Gamma-Ray-Catalogue [HAWC Observatory]</a>
            </li>
          </ul>
        </section>
      </div>
    </nav>
  </aside>
</template>
