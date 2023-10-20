<script setup>
import * as d3 from 'd3'
import { onMounted, onUnmounted, ref, toRefs, watch } from 'vue'

const public_path = process.env.BASE_URL

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
  conversionTemporal: {
    type: Function,
    default: d3.timeParse('%d-%m-%Y'),
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
  alto_vis: {
    type: Number,
    default: 600,
  },
  // formatoEtiquetasY: {
  //   default: d => d.toLocaleString('en'),
  //   type: Function,
  // },
  margin: {
    type: Object,
    default: () => ({
      top: 10,
      right: 10,
      bottom: 20,
      left: 50,
    }),
  },
})

const { datos, variables, margin } = toRefs(props)

// const width_limit = 769
const tooltip_data_seleccionada = ref({})

const svg = ref({})
const grupo_contenedor = ref({})
const grupo_frente = ref({})
const grupo_fondo = ref({})
const grupo_contenedor_ejes = ref({})

// const texto_x = ref({})
// const texto_y = ref({})

const xAxis = ref({})
const yAxis = ref({})

const guia_x = ref({})

const width = ref()
const height = ref()

const xScale = ref({})
const yScale = ref({})

const data_stack = ref([])

const areaGenerator = ref({})
const area = ref({})

const tooltip = ref({})
const tooltipRef = ref('')
const tooltipCifraRef = ref('')

/**
 * Método para configurar las dimensiones del elemento SVG
 */
function configurandoDimensionesParaSVG() {
  // width.value =
  //   document.getElementById('contenedor_vis').clientWidth -
  //   props.margin.left -
  //   props.margin.right
  width.value =
    document.querySelector(`#${props.area_id}`).clientWidth -
    margin.value.right -
    margin.value.left

  height.value = props.alto_vis - margin.value.top - margin.value.bottom
  // window.innerWidth >= width_limit // 769
  //   ? (height.value = 600 - props.margin.top - props.margin.bottom) // Desktop
  //   : (height.value = 400 - props.margin.top - props.margin.bottom) // Mobile

  svg.value
    .attr('width', width.value + margin.value.right + margin.value.left)
    .attr('height', height.value + margin.value.top + margin.value.bottom)
  // .style('background-color', '#efefef99') // Comentar fondo

  grupo_contenedor.value.attr(
    'transform',
    `translate(${margin.value.left}, ${margin.value.top})`
  )

  grupo_fondo.value.attr(
    'transform',
    `translate(${margin.value.left}, ${margin.value.top})`
  )

  grupo_frente.value.attr(
    'transform',
    `translate(${margin.value.left}, ${margin.value.top})`
  )

  grupo_contenedor_ejes.value.attr(
    'transform',
    `translate(${margin.value.left}, ${margin.value.top})`
  )

  // // Labels title
  // texto_x.value
  //   .attr('transform', `translate(${width.value * 0.5}, ${height.value + 25})`)
  //   .style('text-anchor', 'middle')
  //   .style('font-size', '10px')
  //   .style('dominant-baseline', 'hanging')
  //   .style('color', '#efefef')
  // texto_y.value
  //   .attr(
  //     'transform',
  //     `translate(${-props.margin.left}, ${height.value * 0.5}) rotate(-90)`
  //   )
  //   .style('text-anchor', 'middle')
  //   .style('font-size', '10px')
  //   .style('dominant-baseline', 'hanging')
  //   .style('color', '#efefef')
}
/**
 * Método para traducir el formato de fecha
 */
function multiFormat(date) {
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
/**
 * Método para configurar dimensiones para área
 */
function configurandoDimensionesParaArea() {
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
    .range([height.value, 0])
    .nice()
  // Build X scale -> it is a date format
  xScale.value = d3
    .scaleTime()
    .domain(d3.extent(datos.value.map(d => d.date)))
    .range([0, width.value])
  // .nice()

  guia_x.value
    .attr('x1', 0)
    .attr('y1', yScale.value(0))
    .attr('x2', 0)
    .attr('y2', yScale.value(100))
    .style('stroke-opacity', 0)

  areaGenerator.value = d3
    .area()
    .x(d => xScale.value(d.data.date))
    .y0(d => yScale.value(d[0]))
    .y1(d => yScale.value(d[1]))
    .curve(d3.curveLinear)

  // Construyendo ejes
  // Add Y axis
  yAxis.value.call(
    d3.axisLeft(yScale.value).tickSize(-width.value).ticks(5)
    // .tickFormat(props.formatoEtiquetasY)
  )
  yAxis.value
    .selectAll('line')
    // .attr('x2', width.value)
    .style('stroke-dasharray', '3 2 ')
    .style('color', '#EFEFEF')
  // .style('stroke', 'gray')
  yAxis.value.selectAll('.domain').remove()
  // Add X axis
  xAxis.value
    .call(
      d3.axisBottom(xScale.value).ticks(5).tickFormat(multiFormat)
      // .tickSize(-height.value)
    )
    .attr('transform', `translate(${0}, ${height.value})`)
  xAxis.value.selectAll('text').style('dominant-baseline', 'middle')
  xAxis.value
    .selectAll('line')
    .attr('y1', -height.value)
    .style('stroke-dasharray', '3 2')
    .style('color', '#EFEFEF')
  xAxis.value.selectAll('.domain').remove()
  // eje_x.value.select('path').remove()

  // // Estilos de textos en los ejes
  // // Font text Y
  // yAxisG
  //   .selectAll('.tick text')
  //   // .style('font-family', 'Montserrat')
  //   .style('font-size', '10px')
  //   .style('color', '#efefef')
  // // Color lines
  // yAxisG.selectAll('.tick line').style('stroke', '#efefef')
  // // --------------
  // // Font text X
  // xAxisG
  //   .selectAll('.tick text')
  //   // .style('font-family', 'Montserrat')
  //   .style('font-size', '10px')
  //   .style('text-transform', 'uppercase')
  // // Color lines
  // xAxisG.selectAll('.tick line').style('stroke', '#efefef')
}
/**
 * Método para desplegar el tooltip
 */
function mostrarTooltip(evento) {
  let bisecetDate = d3.bisector(d => d.date).left
  let x0 = xScale.value.invert(evento.layerX - margin.value.left)
  // let x0 = xScale.value.invert(evento.layerX - 279) // 230
  // let x0 = xScale.value.invert(evento.layerX - 362) // 230
  let indice = bisecetDate(datos.value, x0, 1)
  let d0 = datos.value[indice - 1]
  let d1 = datos.value[indice]

  if ((d0 !== undefined) & (d1 !== undefined)) {
    tooltip_data_seleccionada.value = x0 - d0.date > d1.date - x0 ? d1 : d0
    guia_x.value
      .transition()
      .duration(100)
      .attr('x1', xScale.value(tooltip_data_seleccionada.value.date))
      .attr('x2', xScale.value(tooltip_data_seleccionada.value.date))
      .attr('y1', 0)
      .attr('y2', height.value)
      .style('stroke-opacity', 1)

    tooltip.value
      .style('visibility', 'visible')
      .style('left', `${evento.layerX}px`)
      .style('top', `${evento.layerY}px`)

    let cifras_variables = variables.value.map(
      d => `<p>      
            <span class="nomenclatura-tooltip" style="width: 10px;
          height: 10px;
          border-radius: 50%;
          border: solid 1px rgba(255, 255, 255, 0.7);
          display: inline-block;background: ${d.color} "></span>
            ${d.nombre} <b>${tooltip_data_seleccionada.value[
        d.id
      ].toLocaleString('en')}</b>
      <br /> <br />
      ${tooltip_data_seleccionada.value.date
        .toString()
        .slice(4, 15)}            
            </p>`
    )
    let textoTooltip = cifras_variables.join('')

    d3.select(tooltipCifraRef.value).html(textoTooltip)
  }
}
/**
 * Método para esconder el tooltip
 */
function cerrarTooltip() {
  tooltip.value.style('visibility', 'hidden')
  // .style('left', '0')
  // .style('top', '0')
}
/**
 * Método para crear los paths del área
 */
function creandoArea() {
  // remove all area created
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
/**
 * Método para actualizar los paths trazados del área
 */
function actualizandoArea() {
  area.value
    .data(data_stack.value)
    // .transition()
    // .duration(500)
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

  grupo_contenedor_ejes.value = svg.value.select('g.grupo-contenedor-ejes')

  xAxis.value = grupo_frente.value.select('g.eje-x')
  yAxis.value = grupo_frente.value.select('g.eje-y')

  guia_x.value = grupo_frente.value
    .select('line.guia-x')
    .style('stroke', 'gray')

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
watch(margin, () => {
  reescalandoPantalla()
})
</script>

<template>
  <div class="contenedor-area">
    <div v-bind:id="area_id">
      <div class="contenedor-vis">
        <div id="contenedor_svg">
          <svg class="svg-area">
            <g class="grupo-fondo"></g>
            <g class="grupo-contenedor-area"></g>
            <g class="grupo-contenedor-ejes"></g>
            <g class="grupo-frente">
              <g class="eje-x"></g>
              <g class="eje-y"></g>
              <line class="guia-x"></line>
            </g>
          </svg>
        </div>
        <div
          class="tooltip-area"
          ref="tooltipRef"
        >
          <div class="contenedor-boton-cerrar">
            <button
              class="boton-cerrar-tooltip"
              @click="cerrarTooltip()"
            >
              <img
                :src="`${public_path}imgs/cerrar.svg`"
                alt="Cerrar Tooltip"
              />
              &times;
            </button>
          </div>
          <p
            class="tooltip-cifra"
            ref="tooltipCifraRef"
          >
            120 | <b> 29.3%</b>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contenedor-area {
  .contenedor-vis {
    .tooltip-area {
      position: absolute;
      visibility: hidden;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 8px;
      padding: 10px;
      color: #fff;
      font-size: 12px;
      line-height: 1;
      p {
        margin: 0;
      }
      .contenedor-boton-cerrar {
        float: right;
        height: auto;
        width: 35px;
        // padding-top: 5px;
        justify-content: space-between;
        @media (min-width: 769px) {
          // En escritorio el botón de cerrar desaparece
          display: none;
        }
        button.boton-cerrar-tooltip {
          background: none;
          border: none;
          padding: 0 0 0 5px;
          max-width: none;
          img {
            height: 30px;
            width: 30px;
            max-width: none;
          }
        }
      }
    }
  }
}
</style>
