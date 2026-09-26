<script setup>
const d3jsRoutes = [
  { titulo: 'Flow diagram', link: '/visualization/sankey-diagram' },
  { titulo: 'Heatmap', link: '/visualization/heatmap-diagram' },
  { titulo: 'Multiline', link: '/visualization/multiline-diagram' },
  { titulo: 'Area', link: '/visualization/area-diagram' },
]

const visualizationRoutes = [
  {
    titulo: 'Thesis-project [UAM-A]',
    href: 'https://github.com/ciretorres/thesis-project',
  },
  {
    titulo: 'Interactive Solid Waste System [CDMX]',
    href: 'https://ciretorres.github.io/flujo-de-residuos-solidos-cdmx/',
  },
  {
    titulo: 'AR-System UNIVERSUM [UIC]',
    href: 'https://ciretorres.github.io/AR-System-UNIVERSUM/',
  },
  {
    titulo: '3D Gamma-Ray-Catalogue [HAWC Observatory]',
    href: 'https://github.com/ciretorres/2HAWC',
  },
]
</script>

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
            <li
              v-for="(value, idx) in d3jsRoutes"
              :key="`rutad3js-${idx}`"
            >
              <nuxt-link :to="value.link">
                {{ value.titulo }}
              </nuxt-link>
            </li>
          </ul>
        </section>

        <section
          id="maps"
          aria-label="mapas"
        >
          <ul>
            <li>
              +
              <nuxt-link to="/visualization/maps">Maps</nuxt-link>
            </li>
          </ul>
        </section>

        <section
          id="visualizations"
          aria-label="visualizations"
        >
          <ul>
            <li
              v-for="(value, idx) in visualizationRoutes"
              :key="`rutavisualization-${idx}`"
            >
              <a
                :href="value.href"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ value.titulo }}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </nav>
  </aside>
</template>
