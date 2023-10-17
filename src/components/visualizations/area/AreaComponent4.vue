<script setup>
import * as d3 from 'd3'
import { onMounted, onUnmounted, ref, toRefs, watch } from 'vue'

// const public_path = process.env.BASE_URL

const props = defineProps({
  area_id: {
    type: String,
    default: () => 'area',
  },
  datos: {
    type: Array,
    default: () => [{ variable: '2021-01-01', cantidad: '30' }],
  },
  variables: {
    type: Array,
    default: function () {
      return [{ id: 'value', nombre: 'value', color: '#FFFFFF' }]
    },
  },
  titulo_eje_y: {
    type: String,
    default: 'Título eje y',
  },
  titulo_eje_x: {
    type: String,
    default: 'Título eje x',
  },
  titulo: String,
  instruccional: String,
  fecha_actualizacion: {
    type: String,
    default: 'dd/mm/aaaa',
  },
  titulo_leyenda: {
    type: String,
    default: 'Título de leyenda',
  },
  titulo_tooltip: {
    type: String,
    default: 'Título tooltip',
  },
  ancho_tooltip: {
    type: Number,
    default: 140,
  },
  alto_vis: {
    type: Number,
    default: 400,
  },
  margen: {
    type: Object,
    default: () => ({
      arriba: 10,
      derecha: 10,
      abajo: 20,
      izquierda: 50,
    }),
  },
})

const { datos, variables, margen } = toRefs(props)

// // const width_limit = 769
const tooltip_data_seleccionada = ref({})

const ancho_leyenda_y = ref(0)

const svg = ref({})
const grupo_contenedor = ref({})
const grupo_frente = ref({})
const grupo_fondo = ref({})
// const grupo_contenedor_ejes = ref({})

// // const texto_x = ref({})
// // const texto_y = ref({})

const xAxis = ref({})
const yAxis = ref({})

// const guia_x = ref({})

const width = ref(100)
const alto = ref(100)

const xScale = ref({})
const yScale = ref({})

const data_stack = ref([])

const area = ref({})
const areaGenerator = ref({})

const tooltip = ref({})
const tooltipRef = ref('')
// const tooltipCifraRef = ref('')

function configurandoDimensionesParaSVG() {
  /**
   * Método para configurar las dimensiones del elemento SVG
   */
  ancho_leyenda_y.value = document.querySelector(
    '#' + props.area_id + ' .rotation-wrapper-outer .element-to-rotate'
  ).clientHeight
  width.value =
    document.querySelector(`#${props.area_id}`).clientWidth -
    margen.value.derecha -
    margen.value.izquierda -
    ancho_leyenda_y.value

  alto.value = props.alto_vis - margen.value.arriba - margen.value.abajo
  // // window.innerWidth >= width_limit // 769
  // //   ? (height.value = props.alto_vis - props.margin.arriba - props.margin.abajo) // Desktop
  // //   : (height.value = 400 - props.margin.arriba - props.margin.abajo) // Mobile

  svg.value
    .attr('width', width.value + margen.value.derecha + margen.value.izquierda)
    .attr('height', alto.value + margen.value.arriba + margen.value.abajo)
    .style('left', ancho_leyenda_y.value + 'px')
    .style('background-color', '#efefef99') // Comentar fondo

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

  // grupo_contenedor_ejes.value.attr(
  //   'transform',
  //   `translate(${margin.value.left}, ${margin.value.top})`
  // )

  // // // Labels title
  // // texto_x.value
  // //   .attr('transform', `translate(${width.value * 0.5}, ${height.value + 25})`)
  // //   .style('text-anchor', 'middle')
  // //   .style('font-size', '10px')
  // //   .style('dominant-baseline', 'hanging')
  // //   .style('color', '#efefef')
  // // texto_y.value
  // //   .attr(
  // //     'transform',
  // //     `translate(${-props.margin.left}, ${height.value * 0.5}) rotate(-90)`
  // //   )
  // //   .style('text-anchor', 'middle')
  // //   .style('font-size', '10px')
  // //   .style('dominant-baseline', 'hanging')
  // //   .style('color', '#efefef')
}
function multiFormat(date) {
  /**
   * Método para traducir el formato de fecha
   */
  // const locale = d3.timeFormatLocale({
  //   decimal: ',',
  //   thousands: '.',
  //   grouping: [3],
  //   currency: ['€', ''],
  //   dateTime: '%A, %e %B %Y г. %X',
  //   date: '%d.%m.%Y',
  //   time: '%H:%M:%S',
  //   periods: ['AM', 'PM'],
  //   days: [
  //     'Domingo',
  //     'Lunes',
  //     'Martes',
  //     'Miércoles',
  //     'Jueves',
  //     'Viernes',
  //     'Sábado',
  //   ],
  //   shortDays: ['Dom', 'Lun', 'Mar', 'Mi', 'Jue', 'Vie', 'Sab'],
  //   months: [
  //     'Enero',
  //     'Febrero',
  //     'Marzo',
  //     'Abril',
  //     'Mayo',
  //     'Junio',
  //     'Julio',
  //     'Agosto',
  //     'Septiembre',
  //     'Octubre',
  //     'Noviembre',
  //     'Diciembre',
  //   ],
  //   shortMonths: [
  //     'ene',
  //     'feb',
  //     'mar',
  //     'abr',
  //     'may',
  //     'jun',
  //     'jul',
  //     'ago',
  //     'sep',
  //     'oct',
  //     'nov',
  //     'dic',
  //   ],
  // })
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
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    shortMonths: [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ],
  })

  const formatMillisecond = locale.format('.%L')
  const formatSecond = locale.format(':%S')
  const formatMinute = locale.format('%I:%M')
  const formatHour = locale.format('%I %p')
  const formatDay = locale.format('%a %d')
  const formatWeek = locale.format('%b %d')
  // const formatMonth = locale.format('%b'),
  const formatMonthYear = locale.format('%b/%Y')
  // const formatYear = locale.format('%Y')

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
function configurandoDimensionesParaArea() {
  /**
   * Método para configurar dimensiones para área
   */
  // Apilando datos
  data_stack.value = d3.stack().keys(variables.value.map(d => d.id))(
    datos.value
  )
  // Asignarle un objeto en data a la data apilada
  for (let i = variables.value.length - 1; i >= 0; i -= 1) {
    data_stack.value[i].forEach(dd => {
      dd.data = Object.assign({}, dd.data, {
        key: data_stack.value[i].key,
      })
    })
  }
  // Construyendo escalas
  // Build Y scale -> it is linear
  yScale.value = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(datos.value.map(d => d3.sum(variables.value.map(dd => d[dd.id])))),
    ])
    .range([alto.value, 0])
  // .nice()
  // Build X scale -> it is a date format
  xScale.value = d3
    .scaleTime()
    .domain(d3.extent(datos.value.map(d => d.date)))
    .range([0, width.value])
  // .nice()

  // Línea guía del puntero
  // guia_x.value
  //   .attr('x1', 0)
  //   .attr('y1', yScale.value(0))
  //   .attr('x2', 0)
  //   .attr('y2', yScale.value(100))
  //   .style('stroke-opacity', 0)

  // Asignando las escalas para el área
  areaGenerator.value = d3
    .area()
    .x(d => xScale.value(d.data.date))
    .y0(d => yScale.value(d[0]))
    .y1(d => yScale.value(d[1]))
    .curve(d3.curveLinear)

  // Construyendo ejes
  // Add Y axis
  yAxis.value.call(
    d3.axisLeft(yScale.value).ticks(5)
    // .tickFormat(props.formatoEtiquetasY)
  )
  yAxis.value
    .selectAll('line')
    .attr('x2', width.value)
    .style('stroke-dasharray', '3 2 ')
    .style('color', '#EFEFEF')
  // .style('stroke', 'gray')
  yAxis.value.selectAll('.domain').remove()
  // Add X axis
  xAxis.value
    .call(d3.axisBottom(xScale.value).ticks(5).tickFormat(multiFormat))
    .attr('transform', `translate(${0}, ${alto.value})`)
  xAxis.value.selectAll('text').style('dominant-baseline', 'middle')
  xAxis.value
    .selectAll('line')
    .attr('y1', -alto.value)
    .style('stroke-dasharray', '3 2')
    .style('color', '#EFEFEF')
  // xAxis.value.selectAll('.domain').remove()
  xAxis.value.select('path').remove()

  // yAxis.value.selectAll('path').remove()
  // yAxis.value.selectAll('line').remove()

  // // // Estilos de textos en los ejes
  // // // Font text Y
  // // yAxisG
  // //   .selectAll('.tick text')
  // //   // .style('font-family', 'Montserrat')
  // //   .style('font-size', '10px')
  // //   .style('color', '#efefef')
  // // // Color lines
  // // yAxisG.selectAll('.tick line').style('stroke', '#efefef')
  // // // --------------
  // // // Font text X
  // // xAxisG
  // //   .selectAll('.tick text')
  // //   // .style('font-family', 'Montserrat')
  // //   .style('font-size', '10px')
  // //   .style('text-transform', 'uppercase')
  // // // Color lines
  // // xAxisG.selectAll('.tick line').style('stroke', '#efefef')
}
function mostrarTooltip(evento) {
  /**
   * Método para desplegar el tooltip
   */
  let bisecetDate = d3.bisector(d => d.date).left
  let x0 = xScale.value.invert(evento.layerX - margen.value.izquierda)
  let indice = bisecetDate(datos.value, x0, 1)
  let d0 = datos.value[indice - 1]
  let d1 = datos.value[indice]

  if ((d0 !== undefined) & (d1 !== undefined)) {
    tooltip_data_seleccionada.value = x0 - d0.date > d1.date - x0 ? d1 : d0
    // guia_x.value
    //   .transition()
    //   .duration(100)
    //   .attr('x1', xScale.value(tooltip_data_seleccionada.value.date))
    //   .attr('x2', xScale.value(tooltip_data_seleccionada.value.date))
    //   .attr('y1', 0)
    //   .attr('y2', alto.value)
    //   .style('stroke-opacity', 1)

    // Change tooltip position from cursor depending the hover area
    tooltip.value
      .style('visibility', 'visible')
      .style(
        'left',
        evento.layerX >
          0.5 * (width.value + margen.value.izquierda + margen.value.derecha)
          ? `${
              evento.layerX - props.ancho_tooltip + ancho_leyenda_y.value - 20
            }px`
          : `${evento.layerX + ancho_leyenda_y.value + 20}px`
      )
      .style('top', 0 + 'px')
    // .attr('width', props.ancho_tooltip)
    // .attr('height', 30)

    const contenidoTooltip = tooltip.value
      .select('div.tooltip-contenido')
      .style('background', 'rgba(0, 0, 0,.8)')
      // .style('min-width', props.ancho_tooltip)
      .style('border-radius', '8px')
      .style('width', `${props.ancho_tooltip}px`)
      .style('padding', '0 3px 0 10px')

    let cifras_variables = variables.value.map(
      d => `<p>
            <span class="nomenclatura-tooltip" style="background: ${
              d.color
            } "></span>
            ${d.nombre}: <b>${tooltip_data_seleccionada.value[
        d.id
      ].toLocaleString('en')}</b>
      <br /> date:
          ${tooltip_data_seleccionada.value.date.toString().slice(4, 15)}
            </p>`
    )
    let textoTooltip = cifras_variables.join('')

    contenidoTooltip
      .select('div.tooltip-cifras')
      .html(textoTooltip)
      .style('margin', '0')
      .style('padding', '0 0 5px 0')

    // tooltip.value
    //   .style('height', contenidoTooltip.style('height'))
    //   .style('width', contenidoTooltip.style('width'))
  }
}
function cerrarTooltip() {
  /**
   * Método para esconder el tooltip
   */
  tooltip.value.style('visibility', 'hidden')
}
function creandoArea() {
  /**
   * Método para crear los paths del área
   */
  // Remove all area created
  grupo_contenedor.value.selectAll('path.paths-area').remove()

  // Join path with color values
  area.value = grupo_contenedor.value
    .selectAll('gpaths')
    .data(data_stack.value)
    .enter()
    .append('path')
    .attr('class', d => `${d.key} paths-area`)
    .style('fill', (d, i) => variables.value[i].color)
    .style('opacity', 0.8)

  svg.value
    .on('mousemove', evento => {
      mostrarTooltip(evento)
    })
    .on('click', evento => {
      mostrarTooltip(evento)
    })
    .on('mouseout', cerrarTooltip)
}
function actualizandoArea() {
  /**
   * Método para actualizar los paths trazados del área
   */
  area.value
    .data(data_stack.value)
    .transition()
    .duration(500)
    .attr('d', areaGenerator.value)
}
function reescalandoPantalla() {
  configurandoDimensionesParaSVG()
  configurandoDimensionesParaArea()
  actualizandoArea()
}

onMounted(() => {
  // Asigna elementos a variables
  svg.value = d3.select(`div#${props.area_id} svg.svg-area`)
  grupo_contenedor.value = svg.value.select('g.grupo-contenedor-area')
  grupo_frente.value = svg.value.select('g.grupo-frente')
  grupo_fondo.value = svg.value.select('g.grupo-fondo')

  // grupo_contenedor_ejes.value = svg.value.select('g.grupo-contenedor-ejes')

  xAxis.value = grupo_fondo.value.select('g.eje-x')
  yAxis.value = grupo_fondo.value.select('g.eje-y')

  // paths-area.value = grupo_fondo.value.select('line.guia-x').style('stroke', 'gray')

  // texto_x.value = grupo_contenedor_ejes.value
  //   .append('text')
  //   .text(props.titulo_eje_x)
  //   .attr('class', 'label-x')
  //   .style('font-weight', '600')
  // texto_y.value = grupo_contenedor_ejes.value
  //   .append('text')
  //   .text(props.titulo_eje_y)
  //   .attr('class', 'label-y')
  //   .style('font-weight', '600')

  configurandoDimensionesParaSVG()
  configurandoDimensionesParaArea()
  creandoArea()
  actualizandoArea()

  // tooltip.value = d3.select('div#' + props.area_id + ' div.tooltip')
  tooltip.value = d3.select(tooltipRef.value)

  window.addEventListener('resize', reescalandoPantalla)
})

onUnmounted(() => {
  window.removeEventListener('resize', reescalandoPantalla)
})
watch(variables, () => {
  configurandoDimensionesParaSVG()
  configurandoDimensionesParaArea()
  creandoArea()
  actualizandoArea()
})
watch(datos, () => {
  configurandoDimensionesParaSVG()
  configurandoDimensionesParaArea()
  creandoArea()
  actualizandoArea()
})
watch(margen, () => {
  reescalandoPantalla()
})
</script>

<template>
  <div
    :id="area_id"
    class="contenedor-area"
  >
    <slot name="encabezado"></slot>
    <div class="contenedor-tooltip-svg">
      <div
        ref="tooltipRef"
        class="tooltip"
      >
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
            class="element-to-rotate"
            :style="{
              width: `${alto_vis - margen.arriba - margen.abajo}px`,
              transform: `rotate(-90deg)translateX(calc(-100% - ${
                0.5 * margen.arriba
              }px))`,
            }"
          >
            <p
              style="padding: 10px 0 5px 0"
              v-html="titulo_eje_y"
            ></p>
          </div>
        </div>
      </div>
      <svg class="svg-area">
        <g class="grupo-fondo">
          <g class="eje-x"></g>
          <g class="eje-y"></g>
          <line class="guia-x"></line>
        </g>
        <g class="grupo-contenedor-area"></g>
        <g class="grupo-contenedor-de-ejes"></g>
        <g class="grupo-frente">
          <!-- <g class="eje-x"></g>
          <g class="eje-y"></g> -->
          <!-- <line class="guia-x"></line> -->
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
  </div>
</template>

<style lang="scss" scoped>
svg.svg-area {
  position: absolute;
  top: 0;
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
