<script setup>
import * as d3 from 'd3'
import { sankey } from 'd3-sankey'
import { sankeyLinkHorizontal } from 'd3-sankey'

import { onMounted, onUnmounted, ref, toRefs, watch } from 'vue'

const props = defineProps({
  sankey_id: String,
  enlace_proyecto: String,
  titulo_proyecto: String,
  titulo: String,
  fecha_actualizacion: String,
  instruccional: String,
  datos: Object,
  contenido_tooltip: Function,
  alto_vis: { type: Number, default: 800 },
  ancho_vis: { type: Number, default: 600 },
  alto_nodo: { type: Number, default: 20 },
  ancho_nodo: { type: Number, default: 15 },
  separacion_nodo: { type: Number, default: 10 },
  texto_notas: String,
  texto_fuente: String,
  link_descarga_csv: String,
  margen: {
    type: Object,
    default: function () {
      return { arriba: 20, abajo: 20, izquierda: 20, derecha: 20 }
    },
  },
})

const isTouchDevice = () =>
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0

const VM_isTouchDevice = isTouchDevice()

const { datos } = toRefs(props)

const svg = ref({})
const tooltip = ref({})

const width = ref(100)
const height = ref(100)

function actualizarGraficaZoom() {}

function configurandoDimensionesParaSVG() {
  width.value =
    document.getElementById(props.sankey_id).clientWidth -
    props.margen.izquierda -
    props.margen.derecha

  height.value = props.alto_vis + props.margen.arriba + props.margen.abajo

  svg.value
    .attr('width', width.value + props.margen.izquierda + props.margen.derecha)
    .attr('height', height.value + props.margen.arriba + props.margen.abajo)

  //this.grupo_contenedor.attr("transform", `translate(${this.margen.izquierda},${this.margen.arriba})`)

  const extent = [
    [props.margen.izquierda, props.margen.arriba],
    [width.value, height.value],
  ]

  const zoom = d3
    .zoom()
    .scaleExtent([1.5, 8])
    .translateExtent(extent)
    .extent(extent)
    .on('zoom', evento => actualizarGraficaZoom(evento))

  svg.value.call(zoom)
}

function configurandoDimensionesParaSankey() {}

function creandoSankey() {
  svg.value.attr('viewBox', [0, -20, props.ancho_vis, props.alto_vis + 20])

  const { nodes, links } = sankey()
    .nodeId(d => d.name)
    .nodeWidth(props.ancho_nodo)
    .nodeSort(false)
    .nodePadding(props.separacion_nodo)
    .extent([
      [1, 1],
      [props.ancho_vis, props.alto_vis - props.alto_nodo],
    ])(datos.value)

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
    .style('font-family', 'Arial')
    .style('font-size', '10pt')
    .style('max-width', '200px')
    .style('padding', '5px')
    .style('background-color', '#FFF')
    .text('Tooltip')

  link
    .append('path')
    .attr('d', sankeyLinkHorizontal())
    .attr('stroke', d => d.color)
    .attr('stroke-width', d => Math.max(1, d.width))
    .attr('opacity', '0.5')
    .on('mouseover', function (d, i) {
      d3.select(this).transition().duration('50').attr('opacity', '1')
      tooltip.value.style('background-color', i.color)
      tooltip.value.style('color', i.color === '#000000' ? '#FFF' : '#000')
      tooltip.value.text(
        '' +
          i.source.name +
          ' → ' +
          i.target.name +
          ' : ' +
          i.value +
          ' MtMS/año'
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

  svg.value
    .append('g')
    .attr('font-family', 'sans-serif') //Quitar para dejar fuente general
    .attr('font-size', 9)
    .selectAll('text')
    .data(nodes)
    .join('text')
    .attr('x', d => (d.x0 < props.ancho_vis / 2 ? d.x1 + 6 : d.x0 - 6))
    .attr('y', d => (d.y1 + d.y0) / 2)
    .attr('dy', '0.35em')
    .attr('text-anchor', d => (d.x0 < props.ancho_vis / 2 ? 'start' : 'end'))
    .text(d => (d.name.length <= 15 ? d.name : d.name.substring(0, 15) + '...'))
    .attr('class', 'node-text-rect')
    .attr('id', function (d, i) {
      d.id = i
      return 'rect-text-' + i
    })
    .on('mouseover', function (d, i) {
      tooltip.value.style('background-color', i.color)
      tooltip.value.style('color', i.color === '#000000' ? '#FFF' : '#000')
      tooltip.value.text(
        '' + i.name + ' : ' + i.value.toLocaleString() + ' MtMS/año'
      )
      tooltip.value.style('visibility', 'visible')
    })
    .on('mouseleave', function () {
      tooltip.value.style('visibility', 'hidden')
    })
    .append('tspan')
    .attr('font-size', 8)
    .attr('fill-opacity', 0.7)
    .text(d => ` (${d.value.toLocaleString()})`)

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
    .attr('fill', d => d.color)
    .attr('class', 'node-rect')
    .attr('id', function (d, i) {
      d.id = i
      return 'rect-' + i
    })
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

      tooltip.value.style('background-color', i.color)
      tooltip.value.style('color', i.color === '#000000' ? '#FFF' : '#000')
      tooltip.value.text(
        '' + i.name + ' : ' + i.value.toLocaleString() + ' MtMS/año'
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
  //.append('title')
  //.text((d) => `${d.name}\n${d.value} MtMS/año`)
}

function actualizandoSankey() {}

function reescalandoPantalla() {
  configurandoDimensionesParaSVG()
  configurandoDimensionesParaSankey()
  actualizandoSankey()
}

// function mostrarTooltip(evento, datum) {
//   if (props.contenido_tooltip !== undefined) {
//     tooltip.value
//       .style('visibility', 'visible')
//       .style(
//         'left',
//         `${
//           evento.layerX + parseInt(tooltip.value.style('width')) > width.value
//             ? evento.layerX - parseInt(tooltip.value.style('width'))
//             : evento.layerX
//         }px`
//       )
//       .style('top', `${evento.layerY}px`)

//     tooltip.value
//       .select('div.tooltip-contenido')
//       .html(props.contenido_tooltip(datum.data))
//   }
// }
// function cerrarTooltip() {
//   tooltip.value.style('visibility', 'hidden')
// }

// function reestablecerVista() {
//   cerrarTooltip()
// }

onMounted(() => {
  svg.value = d3.select(`div#${props.sankey_id} svg.svg-sankey`)

  tooltip.value = d3.select(`div#${props.sankey_id}`).select('div.tooltip')

  configurandoDimensionesParaSVG()
  configurandoDimensionesParaSankey()
  creandoSankey()
  actualizandoSankey()

  window.addEventListener('resize', reescalandoPantalla)
})

onUnmounted(() => {
  window.removeEventListener('resize', reescalandoPantalla)
})

watch(datos, () => {
  configurandoDimensionesParaSVG()
  configurandoDimensionesParaSankey()
  creandoSankey()
  actualizandoSankey()
})
</script>

<template>
  <div
    class="contenedor-sankey"
    :id="sankey_id"
  >
    <h2>Sankey 3</h2>
    <div class="tooltip">
      <div class="botones">
        <button
          class="boton-cerrar"
          v-if="VM_isTouchDevice"
          @click="cerrarTooltip()"
        >
          <span class="icono-cerrar"></span>
        </button>
      </div>
      <div class="tooltip-contenido"></div>
    </div>

    <div class="container">
      <svg class="svg-sankey">
        <defs />
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
$border-radius-tarjeta: 10px;
div.contenedor-sankey {
  font-family: 'Montserrat';
  width: 100%;
  border: solid black 1px;
  border-radius: $border-radius-tarjeta;
  position: relative;
  .node-text-rect {
    max-width: 60px;
  }
  div.tooltip {
    //min-width: 110px;
    //max-width: 450px;
    background: var(--tooltip-bg-color);
    color: var(--tooltip-color);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    font: normal normal 400 12px/14px 'Montserrat', sans-serif;
    padding: 0.75rem;
    position: absolute;
    * {
      font-size: inherit;
      color: inherit;
    }
    a {
      color: #236ef0;
    }
    .botones {
      // height: 0;
      width: 100%;
      .boton-cerrar {
        float: right;
        border: none;
        height: 20px;
        width: 20px;
        cursor: pointer;
        border-radius: 3px;
        background-color: var(--tooltip-color);
        color: black;
        padding: 2px;
        line-height: 1;
        align-items: center;
        justify-content: center;
        display: inline-flex;
        font-size: 30px;
      }
    }
  }
  svg.svg-sankey::v-deep text {
    font-family: 'Montserrat';
  }
}
</style>
