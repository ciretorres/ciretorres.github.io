<script setup>
import * as d3 from 'd3'
import { onMounted, onUnmounted, ref, toRefs, watch } from 'vue'

const props = defineProps({
  areas_apiladas_id: String,
  datos: Array,
  variables: Array,
  titulo_eje_y: String,
  titulo_eje_x: String,
  nombre_columna_horizontal: String,
  conversionTemporal: {
    type: Function,
    default: d3.timeParse('%d-%m-%Y'),
  },
  logo_conacyt: {
    type: Boolean,
    default: function () {
      return true
    },
  },
  tooltip_activo: {
    default: true,
    type: Boolean,
  },

  ancho_tooltip: {
    type: Number,
    default: 250,
  },
  alto_vis: {
    type: Number,
    default: 200,
  },
  formatoEtiquetasY: {
    default: d => d.toLocaleString('en'),
    type: Function,
  },
  margen: {
    type: Object,
    default: () => ({
      arriba: 10,
      abajo: 20,
      izquierda: 50,
      derecha: 10,
    }),
  },
  // textoTooltip: {
  //   type: Function,
  //   default: function () {
  //     // return `<p>No sirve el tooltip</p>`
  //     // let total_muestras = d3.sum(
  //     //   variables.value.map(d => tooltip_data_seleccionada.value[d.id])
  //     // )
  //     // let cifras_variables = variables.value.map(
  //     //   d => `<p>
  //     //       <span class="nomenclatura-tooltip" style="background: ${
  //     //         d.color
  //     //       } "></span>
  //     //       ${d.nombre} <b>${tooltip_data_seleccionada.value[
  //     //     d.id
  //     //   ].toLocaleString('en')}</b>
  //     //       (${Math.round(
  //     //         (100 * tooltip_data_seleccionada.value[d.id]) / total_muestras
  //     //       )}%)
  //     //       </p>`
  //     // )
  //     // return `${cifras_variables.join('')}`
  //   },
  // },
})

const { datos, variables, margen } = toRefs(props)

const ancho_leyenda_y = ref(0)
const tooltip_data_seleccionada = ref({})

const svg = ref({})
const grupo_contenedor = ref({})
const grupo_frente = ref({})
const grupo_fondo = ref({})

const ancho = ref(100)
const alto = ref(100)

const escalaX = ref({})
const escalaY = ref({})

const guia_x = ref({})

const data_apilada = ref([])
const area = ref({})

const streams_apilados = ref({})

const eje_x = ref({})
const eje_y = ref({})

const tooltip = ref({})

function configurandoDimensionesParaSVG() {
  ancho_leyenda_y.value = document.querySelector(
    '#' +
      props.areas_apiladas_id +
      ' .rotation-wrapper-outer .element-to-rotate'
  ).clientHeight

  ancho.value =
    document.querySelector(`#${props.areas_apiladas_id}`).clientWidth -
    margen.value.derecha -
    margen.value.izquierda -
    ancho_leyenda_y.value
  alto.value = props.alto_vis - margen.value.arriba - margen.value.abajo

  svg.value
    .attr('width', ancho.value + margen.value.derecha + margen.value.izquierda)
    .attr('height', alto.value + margen.value.arriba + margen.value.abajo)
    .style('left', ancho_leyenda_y.value + 'px')

  grupo_contenedor.value.attr(
    'transform',
    `translate(${margen.value.izquierda},${margen.value.arriba})`
  )

  grupo_fondo.value.attr(
    'transform',
    `translate(${margen.value.izquierda},${margen.value.arriba})`
  )

  grupo_frente.value.attr(
    'transform',
    `translate(${margen.value.izquierda},${margen.value.arriba})`
  )
}
function multiFormat(date) {
  /**
   * Método para traducir el formato de fecha
   */
  const locale = d3.timeFormatLocale({
    decimal: ',',
    thousands: '.',
    grouping: [3],
    currency: ['€', ''],
    dateTime: '%A, %e %B %Y г. %X',
    date: '%d.%m.%Y',
    time: '%H:%M:%S',
    periods: ['AM', 'PM'],
    days: [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ],
    shortDays: ['Dom', 'Lun', 'Mar', 'Mi', 'Jue', 'Vie', 'Sab'],
    months: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    shortMonths: [
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic',
    ],
  })
  const formatMillisecond = locale.format('.%L')
  const formatSecond = locale.format(':%S')
  const formatMinute = locale.format('%I:%M')
  const formatHour = locale.format('%I %p')
  const formatDay = locale.format('%a %d')
  const formatWeek = locale.format('%b %d')
  // const formatMonth = locale.format('%b')
  const formatMonthYear = locale.format('%b/%Y')
  // const formatYear = locale.format('%Y')
  // console.log(date)
  return (
    d3.timeSecond(date) < date
      ? formatMillisecond
      : d3.timeMinute(date) < date
      ? formatSecond
      : d3.timeHour(date) < date
      ? formatMinute
      : d3.timeDay(date) < date
      ? formatHour
      : d3.timeMonth(date) < date
      ? d3.timeWeek(date) < date
        ? formatDay
        : formatWeek
      : d3.timeYear(date) < date
      ? formatMonthYear
      : formatMonthYear
  )(date)
}
function configurandoDimensionesParaStream() {
  datos.value.forEach(d => {
    d.fech = props.conversionTemporal(d[props.nombre_columna_horizontal])
  })
  data_apilada.value = d3.stack().keys(variables.value.map(d => d.id))(
    datos.value
  )
  for (let i = variables.value.length - 1; i >= 0; i -= 1) {
    data_apilada.value[i].forEach(dd => {
      dd.data = Object.assign({}, dd.data, {
        key: data_apilada.value[i].key,
      })
    })
  }

  escalaY.value = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(datos.value.map(d => d3.sum(variables.value.map(dd => d[dd.id])))),
    ])
    .range([alto.value, 0])

  escalaX.value = d3
    .scaleTime()
    .domain(d3.extent(datos.value.map(d => d.fech)))
    .range([0, ancho.value])

  guia_x.value
    .attr('x1', 0)
    .attr('y1', escalaY.value(0))
    .attr('x2', 0)
    .attr('y2', escalaY.value(100))
    .style('stroke-opacity', 0)

  area.value = d3
    .area()
    //.x((d)=> this.escalaX.bandwidth()*.5  +this.escalaX(d.data[this.nombre_variables.nombre]))
    .x(d => escalaX.value(d.data.fech))
    .y0(d => escalaY.value(d[0]))
    .y1(d => escalaY.value(d[1]))
    .curve(d3.curveLinear)

  eje_y.value.call(
    d3.axisLeft(escalaY.value).ticks(4).tickFormat(props.formatoEtiquetasY)
  )
  eje_y.value.select('path').style('opacity', 0)
  eje_y.value
    .selectAll('line')
    .attr('x2', ancho.value)
    .style('stroke-dasharray', '3 2 ')
    .style('stroke', 'gray')

  eje_x.value
    .call(d3.axisBottom(escalaX.value).ticks(5).tickFormat(multiFormat))
    .attr('transform', `translate(${0}, ${alto.value})`)
  eje_x.value
    .selectAll('text')
    //.style("text-anchor","middle")
    .style('dominant-baseline', 'middle')
  eje_x.value
    .selectAll('line')
    .attr('y1', -alto.value)
    .style('stroke-dasharray', '3 2')
    .style('stroke', '#707070')
  eje_x.value.select('path').remove()

  eje_y.value.selectAll('path').remove()
  eje_y.value.selectAll('line').remove()
}
function mostrarTooltip(evento) {
  let bisecetDate = d3.bisector(d => d.fech).left
  let x0 = escalaX.value.invert(evento.layerX - margen.value.izquierda)
  let indice = bisecetDate(datos.value, x0, 1)
  let d0 = datos.value[indice - 1]
  let d1 = datos.value[indice]
  if ((d0 !== undefined) & (d1 !== undefined)) {
    tooltip_data_seleccionada.value = x0 - d0.fech > d1.fech - x0 ? d1 : d0
    guia_x.value
      .transition()
      .duration(100)
      .attr('x1', escalaX.value(tooltip_data_seleccionada.value.fech))
      .attr('x2', escalaX.value(tooltip_data_seleccionada.value.fech))
      .attr('y1', 0)
      .attr('y2', alto.value)
      .style('stroke-opacity', 1)

    tooltip.value
      .style('visibility', 'visible')
      .style(
        'left',
        evento.layerX >
          0.5 * (ancho.value + margen.value.izquierda + margen.value.derecha)
          ? `${
              evento.layerX - props.ancho_tooltip + ancho_leyenda_y.value - 20
            }px`
          : `${evento.layerX + ancho_leyenda_y.value + 20}px`
      )
      .style('top', 0 + 'px')
      .attr('width', props.ancho_tooltip)
      .attr('height', 30)

    const contenidoTooltip = tooltip.value
      .select('div.tooltip-contenido')
      .style('background', 'rgba(0, 0, 0,.8)')
      .style('min-width', props.ancho_tooltip)
      .style('border-radius', '8px')
      .style('width', `${props.ancho_tooltip}px`)
      .style('padding', '0 3px 0 10px')

    let total_muestras = d3.sum(
      variables.value.map(d => tooltip_data_seleccionada.value[d.id])
    )
    let cifras_variables = variables.value.map(
      d => `<p>
            <span class="nomenclatura-tooltip" style="background: ${
              d.color
            } "></span>
            ${d.nombre} <b>${tooltip_data_seleccionada.value[
        d.id
      ].toLocaleString('en')}</b>
            (${Math.round(
              (100 * tooltip_data_seleccionada.value[d.id]) / total_muestras
            )}%)
            </p>`
    )
    let textoTooltip = cifras_variables.join('')

    contenidoTooltip
      .select('div.tooltip-cifras')
      .html(textoTooltip)
      .style('margin', '0')
      .style('padding', '0 0 5px 0')

    tooltip.value
      .style('height', contenidoTooltip.style('height'))
      .style('width', contenidoTooltip.style('width'))
  }
}
function cerrarTooltip() {
  tooltip.value.style('visibility', 'hidden')
}
function creandoStreams() {
  grupo_contenedor.value.selectAll('path.paths-streams').remove()

  grupo_contenedor.value.selectAll('path.paths-streams').remove()
  // console.log('data_apilada.value', data_apilada.value)
  streams_apilados.value = grupo_contenedor.value
    .selectAll('gpaths')
    .data(data_apilada.value)
    .enter()
    .append('path')
    .attr('class', d => `${d.key} paths-streams`)
    .style('fill', (d, i) => variables.value[i].color)
  if (props.tooltip_activo) {
    svg.value
      .on('mousemove', evento => {
        mostrarTooltip(evento)
      })
      .on('mouseout', cerrarTooltip)
  }
}
function actualizandoStreams() {
  streams_apilados.value
    .data(data_apilada.value)
    .transition()
    .duration(500)
    .attr('d', area.value)
}
function reescalandoPantalla() {
  configurandoDimensionesParaSVG()
  configurandoDimensionesParaStream()
  actualizandoStreams()
}

onMounted(() => {
  svg.value = d3.select(`div#${props.areas_apiladas_id} svg.svg-streamgraph`)
  grupo_contenedor.value = svg.value.select('g.grupo-contenedor-de-streams')
  grupo_frente.value = svg.value.select('g.grupo-frente')
  grupo_fondo.value = svg.value.select('g.grupo-fondo')

  eje_x.value = grupo_frente.value.select('g.eje-x')
  eje_y.value = grupo_frente.value.select('g.eje-y')

  guia_x.value = grupo_frente.value
    .select('line.guia-x')
    .style('stroke', 'gray')

  configurandoDimensionesParaSVG()
  configurandoDimensionesParaStream()
  creandoStreams()
  actualizandoStreams()

  tooltip.value = d3.select('div#' + props.areas_apiladas_id + ' div.tooltip')
  window.addEventListener('resize', reescalandoPantalla)
})

onUnmounted(() => {
  window.removeEventListener('resize', reescalandoPantalla)
})

watch(variables, () => {
  configurandoDimensionesParaSVG()
  configurandoDimensionesParaStream()
  creandoStreams()
  actualizandoStreams()
})
watch(datos, () => {
  configurandoDimensionesParaSVG()
  configurandoDimensionesParaStream()
  creandoStreams()
  actualizandoStreams()
})
watch(margen, () => {
  reescalandoPantalla()
})
</script>

<template>
  <div
    :id="areas_apiladas_id"
    class="contenedor-stream-graph"
  >
    <slot name="encabezado"></slot>
    <div class="contenedor-tooltip-svg">
      <div class="tooltip">
        <div class="tooltip-contenido">
          <div class="contenedor-boton-cerrar">
            <button
              class="boton-cerrar-tooltip"
              @click="cerrarTooltip"
            >
              &times;
            </button>
          </div>
          <div class="tooltip-cifras"></div>
        </div>
      </div>
      <div class="rotation-wrapper-outer">
        <div class="rotation-wrapper-inner">
          <div
            :style="{
              width: `${alto_vis - margen.arriba - margen.abajo}px`,
              transform: `rotate(-90deg)translateX(calc(-100% - ${
                0.5 * margen.arriba
              }px))`,
            }"
            class="element-to-rotate"
          >
            <p
              style="padding: 10px 0 5px 0"
              v-html="titulo_eje_y"
            ></p>
          </div>
        </div>
      </div>
      <svg class="svg-streamgraph">
        <g class="grupo-fondo"></g>
        <g class="grupo-contenedor-de-streams"></g>
        <g class="grupo-contenedor-de-ejes"></g>
        <g class="grupo-frente">
          <g class="eje-x"></g>
          <g class="eje-y"></g>
          <line class="guia-x"></line>
        </g>
      </svg>
      <div class="eje-x">
        <p
          :style="{
            padding: `${margen.abajo + 10}px ${margen.derecha}px 0 ${
              margen.izquierda + ancho_leyenda_y
            }px `,
          }"
          v-html="titulo_eje_x"
        ></p>
      </div>
    </div>
    <slot name="pie"></slot>
  </div>
</template>

<style lang="scss" scoped>
svg.svg-streamgraph {
  position: absolute;
  top: 0;
}

svg.svg-streamgraph::v-deep text {
  // font-family: 'Montserrat';
}

div.contenedor-tooltip-svg {
  position: relative;
  svg {
    z-index: 1;
  }
  .rotation-wrapper-outer {
    display: table;

    .rotation-wrapper-inner {
      padding: 50% 0;
      height: 0;

      .element-to-rotate {
        display: block;
        transform-origin: top left;
        //transform: rotate(-90deg) translate(-100%);
        margin-top: -50%;
        font-size: 12px;
        text-align: center;
        font-weight: 600;
      }
    }
  }

  div.eje-x {
    position: relative;
    width: 100%;
    text-align: center;
    font-size: 12px;
    text-align: center;
    font-weight: 600;
  }

  div.tooltip {
    color: #fff;
    font-size: 12px;
    position: absolute;
    z-index: 2;
    visibility: hidden;
  }

  div.tooltip::v-deep div.tooltip-cifras {
    padding-bottom: 5px;

    p {
      margin: 3px;

      span.nomenclatura-tooltip {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: solid 1px rgba(255, 255, 255, 0.7);
        display: inline-block;
      }
    }
  }

  div.tooltip div.contenedor-boton-cerrar {
    height: auto;
    display: flex;
    width: 100%;
    padding-top: 5px;
    font-weight: 600;
  }

  div.tooltip button.boton-cerrar-tooltip {
    background: #fff;
    border: none;
    font-size: 30px;
    line-height: 0.9;
    font-weight: 300;
    padding: 0 5px;
    border-radius: 5px;
    margin: 0 0 0 auto;
    @media (min-width: 768px) {
      display: none;
    }
    cursor: pointer;

    img {
      width: 30px;
      height: 30px;
      float: right;
    }
  }
}
</style>
