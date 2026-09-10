<script setup>
import * as d3 from 'd3'
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  sankeyId: {
    type: String,
    default: () => 'sankey',
  },

  datos: {
    type: Object,
    default: () => ({
      nodes: [
        { node: 0, name: 'node0', id: 'node_0', color: '#FFF' },
        { node: 1, name: 'node1', id: 'node_1', color: '#FFF' },
        { node: 2, name: 'node2', id: 'node_2', color: '#FFF' },
      ],
      links: [
        { source: 'node0', target: 'node2', value: 1, color: '#EFF' },
        { source: 'node1', target: 'node2', value: 1, color: '#EFF' },
      ],
    }),
  },

  altoVis: {
    type: Number,
    default: 800,
  },

  anchoVis: {
    type: Number,
    default: 600,
  },

  altoNodo: {
    type: Number,
    default: 20,
  },

  anchoNodo: {
    type: Number,
    default: 15,
  },

  separacionNodo: {
    type: Number,
    default: 10,
  },

  margin: {
    type: Object,
    default: () => ({
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    }),
  },
})
// const { datos } = toRefs(props)

const containerRef = ref(null)
const svgRef = ref(null)
const tooltipRef = ref(null)

const svg = ref(null)
const tooltip = ref(null)

const width = ref(0)
const height = ref(0)

const resizeObserver = null

const nodeWidth = ref(15)
const nodeHeight = ref(20)
const nodePadding = ref(10)

function configurandoDimensionesParaSVG() {
  // set the dimensions and margins of the graph
  const anchoContenedor = containerRef.value.clientWidth

  width.value = Math.max(
    0,
    anchoContenedor
    - props.margin.left
    - props.margin.right,
  )

  height.value = props.altoVis

  const anchoTotal = width.value
    + props.margin.left
    + props.margin.right

  const altoTotal = height.value
    + props.margin.top
    + props.margin.bottom

  svg.value
    .attr('width', anchoTotal)
    .attr('height', altoTotal)
    .attr('viewBox', `0 0 ${anchoTotal} ${altoTotal}`)
}

function configurarTooltip() {
  tooltip.value
    .style('position', 'fixed')
    .style('visibility', 'hidden')
    .style('z-index', '10')
    .style('border', '1px solid #333')
    .style('font-family', 'Arial, sans-serif')
    .style('font-size', '10pt')
    .style('font-weight', 'bold')
    .style('max-width', '200px')
    .style('padding', '5px')
    .style('background-color', '#fff')
}

function mostrarTooltip(event, texto, color = '#000') {
  tooltip.value
    .style('top', `${event.clientY + 10}px`)
    .style('left', `${event.clientX + 10}px`)
    .style('color', color === '#000000' ? '#fff' : '#000')
    .style('background-color', '#000000')
    .style('visibility', 'visible')
    .text(texto)
}

function ocultarTooltip() {
  tooltip.value?.style('visibility', 'hidden')
}

function crearSankey() {
  // Elimina el gráfico anterior antes de volver a dibujarlo
  svg.value.selectAll('*').remove()

  /*
   * d3-sankey modifica internamente los nodos y enlaces.
   * Por eso se crean copias para no modificar props.datos directamente.
   */
  const datosGrafica = {
    nodes: props.datos.nodes.map(node => ({ ...node })),
    links: props.datos.links.map(link => ({ ...link })),
  }

  const layoutSankey = sankey()
    .nodeId(node => node.name)
    .nodeWidth(props.anchoNodo)
    .nodePadding(props.separacionNodo)
    .nodeSort(false)
    .extent([
      [
        props.margin.left,
        props.margin.top,
      ],
      [
        props.margin.left + width.value,
        props.margin.top + height.value,
      ],
    ])

  const { nodes, links } = layoutSankey(datosGrafica)

  const grupoEnlaces = svg.value
    .append('g')
    .attr('fill', 'none')
    .attr('stroke-opacity', 0.5)

  const enlaces = grupoEnlaces
    .selectAll('path')
    .data(links)
    .join('path')
    .attr('d', sankeyLinkHorizontal())
    .attr('stroke', '#efefef')
    .attr('stroke-width', link => Math.max(1, link.width))
    .attr('opacity', 0.5)

  enlaces
    .on('mouseover', function (event, link) {
      d3.select(this)
        .transition()
        .duration(50)
        .attr('opacity', 1)

      mostrarTooltip(
        event,
        `${link.source.name} → ${link.target.name}: ${link.value} value.`,
        link.color,
      )
    })
    .on('mouseout', function () {
      d3.select(this)
        .transition()
        .duration(50)
        .attr('opacity', 0.5)

      ocultarTooltip()
    })

  const grupoNodos = svg.value
    .append('g')
    .attr('stroke', '#333')
    .attr('stroke-width', 0.75)

  const rectangulosNodos = grupoNodos
    .selectAll('rect')
    .data(nodes)
    .join('rect')
    .attr('class', 'node-rect')
    .attr('x', node => node.x0 + 1)
    .attr('y', node => node.y0)
    .attr('width', node => Math.max(0, node.x1 - node.x0 - 2))
    .attr('height', node => node.y1 - node.y0)
    .attr('fill', node => node.color || '#fff')

  const textosNodos = svg.value
    .append('g')
    .attr('font-size', 9)
    .attr('font-weight', 'bold')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .attr('class', 'node-text-rect')
    .attr(
      'x',
      node => node.x0 < width.value / 2
        ? node.x1 + 6
        : node.x0 - 6,
    )
    .attr('y', node => (node.y1 + node.y0) / 2)
    .attr('dy', '0.35em')
    .attr(
      'text-anchor',
      node => node.x0 < width.value / 2
        ? 'start'
        : 'end',
    )
    .attr('fill', '#fff')
    .text(node => node.name)

  textosNodos
    .append('tspan')
    .attr('font-size', 9)
    .attr('fill-opacity', 0.7)
    .text(node => ` (${node.value.toLocaleString()})`)

  rectangulosNodos
    .on('mouseover', function (event, node) {
      const nodosRelacionados = new Set([node.index])

      links.forEach((link) => {
        if (
          link.source.index === node.index
          || link.target.index === node.index
        ) {
          nodosRelacionados.add(link.source.index)
          nodosRelacionados.add(link.target.index)
        }
      })

      enlaces
        .transition()
        .duration(300)
        .style('stroke-opacity', link => (
          link.source.index === node.index
          || link.target.index === node.index
            ? 1
            : 0.2
        ))

      rectangulosNodos
        .style(
          'opacity',
          currentNode => nodosRelacionados.has(currentNode.index)
            ? 1
            : 0.2,
        )

      textosNodos
        .style(
          'opacity',
          currentNode => nodosRelacionados.has(currentNode.index)
            ? 1
            : 0.2,
        )

      mostrarTooltip(
        event,
        `${node.name}: ${node.value.toLocaleString()} value.`,
        node.color,
      )
    })
    .on('mouseleave', function () {
      enlaces
        .transition()
        .duration(300)
        .style('stroke-opacity', 0.5)

      rectangulosNodos.style('opacity', 1)
      textosNodos.style('opacity', 1)

      ocultarTooltip()
    })
}

async function renderizarSankey() {
  await nextTick()

  // if (!svg.value) {
  //   return
  // }

  // const dimensionesConfiguradas
  //   = configurarDimensionesParaSVG()

  // if (!dimensionesConfiguradas) {
  //   return
  // }

  configurarTooltip()
  crearSankey()
}

function reescalandoPantalla() {
  configurandoDimensionesParaSVG()
}

onMounted(async () => {
  svg.value = d3.select(svgRef.value)
  tooltip.value = d3.select(tooltipRef.value)

  await renderizarSankey()

  // resizeObserver = new ResizeObserver(() => {
  //   renderizarSankey()
  // })

  // if (containerRef.value) {
  //   resizeObserver.observe(containerRef.value)
  // }
})

watch(
  () => props.datos,
  () => {
    renderizarSankey()
  },
  {
    deep: true,
    flush: 'post',
  },
)

onUnmounted(() => {
  resizeObserver?.disconnect()

  svg.value?.selectAll('*').remove()

  svg.value = null
  tooltip.value = null
})
</script>

<template>
  <div
    :id="sankeyId"
    ref="containerRef"
    class="sankey-component"
  >
    <!-- eslint-disable vue/html-self-closing -->
    <div
      ref="tooltipRef"
      class="tooltip"
    ></div>

    <div>
      <svg ref="svgRef"></svg>
    </div>
    <!-- eslint-enable vue/html-self-closing -->
  </div>
</template>

<style scoped>
.sankey-component {
  position: relative;
  width: 100%;
  overflow-x: auto;
}

.sankey-component svg {
  display: block;
  width: 100%;
}

.tooltip {
  pointer-events: none;
}
</style>
