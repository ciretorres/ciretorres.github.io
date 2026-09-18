<script setup>
import * as d3 from 'd3'
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  sankeyId: {
    type: String,
    default: () => `sankeyid-${Math.random().toString(36).substring(2)}`,
  },

  datos: {
    type: Object,
    default: () => ({
      nodes: [
        { id: 'node_0', name: 'Node 0', color: '#2563eb' },
        { id: 'node_1', name: 'Node 1', color: '#16a34a' },
        { id: 'node_2', name: 'Node 2', color: '#dc2626' },
      ],
      links: [
        {
          source: 'node_0',
          target: 'node_2',
          value: 1,
          color: '#93c5fd',
        },
        {
          source: 'node_1',
          target: 'node_2',
          value: 1,
          color: '#86efac',
        },
      ],
    }),
  },
  titulo: {
    type: String,
    default: 'Diagrama Sankey de flujos',
  },

  altoVis: {
    type: Number,
    default: 600,
  },

  anchoVis: {
    type: Number,
    default: 800,
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

const containerRef = ref(null)
const svgRef = ref(null)
const tooltipRef = ref(null)

let resizeObserver = null
let animationFrame = null

const formatValue = value => new Intl.NumberFormat('es-ES').format(value)

function getDimensions() {
  // get the dimensions and margins of the graph
  const containerWidth = containerRef.value?.clientWidth

  const outerWidth = containerWidth || props.anchoVis
  const outerHeight = props.altoVis

  const innerWidth = Math.max(
    0,
    outerWidth - props.margin.left - props.margin.right
  )

  const innerHeight = Math.max(
    0,
    outerHeight - props.margin.top - props.margin.bottom
  )

  return {
    outerWidth,
    outerHeight,
    innerWidth,
    innerHeight,
  }
}

function positionTooltip(event) {
  if (!tooltipRef.value) return

  const rect = containerRef.value.getBoundingClientRect()

  tooltipRef.value.style.left = `${event.clientX - rect.left + 12}px`
  tooltipRef.value.style.top = `${event.clientY - rect.top + 12}px`
}

function showTooltip(event, html) {
  if (!tooltipRef.value) return

  tooltipRef.value.innerHTML = html
  tooltipRef.value.hidden = false

  positionTooltip(event)
}

function hideTooltip() {
  if (!tooltipRef.value) return

  tooltipRef.value.hidden = true
}

function highlightNode(node, linkSelection, nodeSelection, labelSelection) {
  const connectedLinks = new Set()

  linkSelection.each(link => {
    const isConnected = link.source.id === node.id || link.target.id === node.id

    if (isConnected) {
      connectedLinks.add(link.source.id)
      connectedLinks.add(link.target.id)
    }
  })

  linkSelection
    .transition()
    .duration(150)
    .style('stroke-opacity', link => {
      const isConnected =
        link.source.id === node.id || link.target.id === node.id

      return isConnected ? 0.9 : 0.12
    })

  nodeSelection
    .transition()
    .duration(150)
    .style('opacity', item => (connectedLinks.has(item.id) ? 1 : 0.25))

  labelSelection
    .transition()
    .duration(150)
    .style('opacity', item => (connectedLinks.has(item.id) ? 1 : 0.25))
}

function resetHighlight(linkSelection, nodeSelection, labelSelection) {
  linkSelection.transition().duration(150).style('stroke-opacity', 0.45)

  nodeSelection.transition().duration(150).style('opacity', 1)

  labelSelection.transition().duration(150).style('opacity', 1)
}

function renderChart() {
  if (!svgRef.value || !containerRef.value) return

  const { outerWidth, outerHeight, innerWidth, innerHeight } = getDimensions()

  if (innerWidth <= 0 || innerHeight <= 0) return

  // append the svg object to the body of the page
  const svg = d3.select(svgRef.value)

  // Limpia el gráfico anterior.
  svg.selectAll('*').remove()

  svg
    .attr('width', '100%')
    .attr('height', outerHeight)
    .attr('viewBox', `0 0 ${outerWidth} ${outerHeight}`)
    .attr('role', 'img')
    .attr('aria-label', props.titulo)

  const chart = svg
    .append('g')
    .attr('transform', `translate(${props.margin.left},${props.margin.top})`)

  // d3-sankey modifica internamente los nodos y enlaces.
  // const graphData = structuredClone(props.datos)
  const graphData = {
    nodes: props.datos.nodes.map(node => ({ ...node })),
    links: props.datos.links.map(link => ({ ...link })),
  }

  // Set the sankey diagram properties
  const layout = sankey()
    .nodeId(node => node.id)
    .nodeWidth(props.anchoNodo)
    .nodePadding(props.separacionNodo)
    .nodeSort(null)
    .extent([
      [0, 0],
      [innerWidth, innerHeight],
    ])

  const { nodes, links } = layout(graphData)

  // add in the links
  const linkGroup = chart
    .append('g')
    .attr('fill', 'none')
    .attr('stroke-linecap', 'round')
  const linkSelection = linkGroup
    .selectAll('path')
    .data(links)
    .join('path')
    .attr('d', sankeyLinkHorizontal())
    .attr('stroke', link => link.color || link.source.color || '#94a3b8')
    // forzando que el valor sea 1 aunque venga en cero
    .attr('stroke-width', link => Math.max(1, link.width))
    .style('stroke-opacity', 0.45)
    .style('cursor', 'pointer')
    .on('pointerenter', function (event, link) {
      d3.select(this).transition().duration(100).style('stroke-opacity', 0.95)

      showTooltip(
        event,
        `
          <strong>${link.source.name}</strong>
          → <strong>${link.target.name}</strong>
          <br>
          Valor: ${formatValue(link.value)}
        `
      )
    })
    .on('pointermove', positionTooltip)
    .on('pointerleave', function () {
      d3.select(this).transition().duration(100).style('stroke-opacity', 0.45)

      hideTooltip()
    })

  // add in the nodes
  const nodeGroup = chart
    .append('g')
    .attr('stroke', '#334155')
    .attr('stroke-width', 0.75)
  const nodeSelection = nodeGroup
    .selectAll('rect')
    .data(nodes)
    .join('rect')
    .attr('x', node => node.x0)
    .attr('y', node => node.y0)
    .attr('width', node => node.x1 - node.x0)
    .attr('height', node => node.y1 - node.y0)
    .attr('rx', 2)
    .attr('fill', node => node.color || '#cbd5e1')
    .style('cursor', 'pointer')
    .on('pointerenter', function (event, node) {
      highlightNode(node, linkSelection, nodeSelection, labelSelection)

      showTooltip(
        event,
        `
          <strong>${node.name}</strong>
          <br>
          Valor: ${formatValue(node.value || 0)}
        `
      )
    })
    .on('pointermove', positionTooltip)
    .on('pointerleave', function () {
      resetHighlight(linkSelection, nodeSelection, labelSelection)

      hideTooltip()
    })

  // Coloca texto alado del nodo rectángulo
  const labelSelection = chart
    .append('g')
    .attr('font-size', 12)
    .attr('font-family', 'system-ui, sans-serif')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .attr('x', node => (node.x0 < innerWidth / 2 ? node.x1 + 8 : node.x0 - 8))
    .attr('y', node => (node.y0 + node.y1) / 2)
    .attr('dy', '0.35em')
    .attr('text-anchor', node => (node.x0 < innerWidth / 2 ? 'start' : 'end'))
    .attr('fill', '#e2e8f0')
    .text(node => `${node.name} (${formatValue(node.value || 0)})`)
    .style('pointer-events', 'none')
}

function scheduleRender() {
  cancelAnimationFrame(animationFrame)

  animationFrame = requestAnimationFrame(() => {
    renderChart()
  })
}

function observeResize() {
  if (!containerRef.value) return

  resizeObserver = new ResizeObserver(() => {
    scheduleRender()
  })

  resizeObserver.observe(containerRef.value)
}

watch(
  () => props.datos,
  async () => {
    await nextTick()
    scheduleRender()
  },
  {
    deep: true,
  }
)

onMounted(async () => {
  await nextTick()

  renderChart()
  observeResize()
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  cancelAnimationFrame(animationFrame)

  d3.select(svgRef.value).selectAll('*').interrupt().remove()
})
</script>

<template>
  <div
    :id="sankeyId"
    ref="containerRef"
    class="sankey-component"
  >
    <!-- eslint-disable vue/html-self-closing -->
    <svg ref="svgRef"></svg>

    <div
      ref="tooltipRef"
      class="tooltip"
      hidden
    ></div>
    <!-- eslint-enable vue/html-self-closing -->
  </div>
</template>

<style scoped>
.sankey-component {
  position: relative;
  width: 100%;
  min-width: 0;
}

.sankey-component svg {
  display: block;
  width: 100%;
  overflow: visible;
}

.tooltip {
  position: absolute;
  z-index: 10;
  max-width: 240px;
  padding: 0.5rem 0.65rem;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #0f172a;
  color: #f8fafc;
  font:
    0.875rem/1.4 system-ui,
    sans-serif;
  pointer-events: none;
  box-shadow: 0 4px 12px rgb(0 0 0 / 20%);
}
</style>
