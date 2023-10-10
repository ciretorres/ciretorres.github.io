<script setup>
import * as d3 from 'd3'
import { sankey } from 'd3-sankey'
import { sankeyLinkHorizontal } from 'd3-sankey'

import { onMounted, onUnmounted, ref, toRefs, watch } from 'vue'

const props = defineProps({
  sankey_id: {
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
  alto_vis: {
    type: Number,
    default: 800,
  },
  ancho_vis: {
    type: Number,
    default: 600,
  },
  alto_nodo: {
    type: Number,
    default: 20,
  },
  ancho_nodo: {
    type: Number,
    default: 15,
  },
  separacion_nodo: {
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

const { datos } = toRefs(props)

const svgRef = ref('')
const svg = ref({})

const tooltip = ref({})

const width = ref(800)
const height = ref(600)

const nodeWidth = ref(15)
const nodeHeight = ref(20)
const nodePadding = ref(10)

function configurandoDimensionesParaSVG() {
  // set the dimensions and margins of the graph
  width.value =
    document.getElementById(props.sankey_id).clientWidth -
    props.margin.left -
    props.margin.right

  height.value = props.alto_vis + props.margin.top + props.margin.bottom

  svg.value
    .attr('width', width.value + props.margin.left + props.margin.right)
    .attr('height', height.value + props.margin.top + props.margin.bottom)

  // const extent = [
  //   [props.margin.left, props.margin.top],
  //   [width.value, height.value],
  // ]
}

function creandoSankey() {
  svg.value.attr('viewBox', [0, -20, width.value, height.value + 20])

  // load the data
  const itemsGrafica = datos.value

  // Set the sankey diagram properties
  const { nodes, links } = sankey()
    .nodeId(d => d.name)
    .nodeWidth(nodeWidth.value)
    .nodeSort(false)
    .nodePadding(nodePadding.value)
    .extent([
      [1, 1],
      [width.value, height.value - nodeHeight.value],
    ])(itemsGrafica)

  const link = svg.value
    .append('g')
    .attr('fill', 'none')
    .attr('stroke-opacity', 0.7)
    .selectAll('g')
    .data(links)
    .join('g')
    .style('mix-blend-mode', 'multiply')

  tooltip.value
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .style('border', '1px solid #333')
    .style('font-family', 'Arial')
    .style('font-size', '10pt')
    .style('font-weight', 'bold')
    .style('max-width', '200px')
    .style('padding', '5px')
    .style('background-color', '#FFF')
    .text('Tooltip')

  // add in the links
  link
    .append('path')
    .attr('d', sankeyLinkHorizontal())
    // .attr('stroke', d => d.color)
    .attr('stroke', '#efefef')
    .attr('stroke-width', d => Math.max(1, d.width))
    .attr('opacity', '0.5')
    .on('mouseover', function (d, i) {
      d3.select(this).transition().duration('50').attr('opacity', '1')
      // tooltip.value.style('background-color', i.color)
      tooltip.value.style('background-color', '#00000')
      tooltip.value.style('color', i.color === '#000000' ? '#FFF' : '#000')
      tooltip.value.text(
        '' +
          i.source.name +
          ' → ' +
          i.target.name +
          ' : ' +
          i.value +
          '  value.'
      )
      tooltip.value.style('visibility', 'visible')
    })
    .on('mouseout', function () {
      d3.select(this).transition().duration('50').attr('opacity', '0.5')
      tooltip.value.style('visibility', 'hidden')
    })
    .on('mousemove', function (d) {
      return tooltip.value
        .style('top', d.pageY + 10 + 'px')
        .style('left', d.pageX + 10 + 'px')
    })

  // Coloca texto alado del nodo rectángulo
  svg.value
    .append('g')
    .attr('font-size', 9)
    .attr('font-weight', 'bold')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .attr('x', d => (d.x0 < width.value / 2 ? d.x1 + 6 : d.x0 - 6))
    .attr('y', d => (d.y1 + d.y0) / 2)
    .attr('dy', '0.35em')
    .attr('text-anchor', d => (d.x0 < width.value / 2 ? 'start' : 'end'))
    .text(d => d.name)
    .attr('class', 'node-text-rect')
    .attr('id', function (d, i) {
      d.id = i
      return 'rect-text-' + i
    })
    .append('tspan')
    .attr('font-size', 9)
    .attr('fill-opacity', 0.7)
    .text(d => ` (${d.value.toLocaleString()})`)

  // add in the nodes
  // add the rectangles for the nodes
  svg.value
    .append('g')
    .attr('stroke', '#333')
    .attr('stroke-width', '0.75')
    .selectAll('rect')
    .data(nodes)
    .join('rect')
    .attr('x', d => d.x0 + 1)
    .attr('y', d => d.y0)
    .attr('height', d => d.y1 - d.y0)
    .attr('width', d => d.x1 - d.x0 - 2)
    // .attr('fill', d => d.color)
    .attr('fill', '#FFFFFF')
    .attr('class', 'node-rect')
    .attr('id', function (d, i) {
      d.id = i
      return 'rect-' + i
    })
    // Add hover text
    .on('mouseover', function (d, i) {
      let nodeHiglight = []
      link
        .transition()
        .duration(300)
        .style('stroke-opacity', function (l) {
          if (l.source.index === i.index || l.target.index === i.index) {
            nodeHiglight.push(l.target.id)
            nodeHiglight.push(l.source.id)
          }
          return l.source.index === i.index || l.target.index === i.index
            ? 1
            : 0.2
        })

      // tooltip.value.style('background-color', i.color)
      tooltip.value.style('background-color', '#00000')
      tooltip.value.style('color', i.color === '#000000' ? '#FFF' : '#000')
      tooltip.value.text(
        '' + i.name + ' : ' + i.value.toLocaleString() + '  value.'
      )
      tooltip.value.style('visibility', 'visible')

      d3.selectAll('.node-rect').style('opacity', 0.2)
      d3.selectAll('.node-text-rect').style('opacity', 0.2)
      for (let i = 0; i < nodeHiglight.length; i++) {
        d3.select('#rect-' + nodeHiglight[i]).style('opacity', 1)
        d3.select('#rect-text-' + nodeHiglight[i]).style('opacity', 1)
      }
    })
    .on('mouseleave', function () {
      link.transition().duration(300).style('stroke-opacity', 0.5)

      d3.selectAll('.node-text-rect').style('opacity', 1)
      d3.selectAll('.node-rect').style('opacity', 1)
      tooltip.value.style('visibility', 'hidden')
    })
    .on('mousemove', function (d) {
      return tooltip.value
        .style('top', d.pageY + 10 + 'px')
        .style('left', d.pageX + 10 + 'px')
    })
}

function reescalandoPantalla() {
  configurandoDimensionesParaSVG()
}

onMounted(() => {
  // append the svg object to the body of the page
  svg.value = d3.select(svgRef.value)
  // .attr('viewBox', [0, -20, width.value, height.value + 20])

  tooltip.value = d3.select(`div#${props.sankey_id}`).select('div.tooltip')

  configurandoDimensionesParaSVG()
  creandoSankey()

  window.addEventListener('resize', reescalandoPantalla)
})

onUnmounted(() => {
  window.removeEventListener('resize', reescalandoPantalla)
})

watch(datos, () => {
  configurandoDimensionesParaSVG()
  creandoSankey()
})
</script>

<template>
  <div
    :id="sankey_id"
    class="sankey-component"
  >
    <div class="tooltip"></div>
    <div>
      <svg ref="svgRef"></svg>
    </div>
  </div>
</template>
