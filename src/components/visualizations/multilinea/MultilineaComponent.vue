<script setup>
import * as d3 from 'd3'
import { onMounted, onUnmounted, ref, toRefs, watch } from 'vue'

const props = defineProps({
  multilineas_id: String,
  datos: {
    Array,
    default: () => [
      { fecha_recoleccion: '2021-01-01', VSIN: 0 },
      { fecha_recoleccion: '2021-02-01', VSIN: 6 },
      { fecha_recoleccion: '2021-03-01', VSIN: 4 },
      { fecha_recoleccion: '2021-04-01', VSIN: 10 },
      { fecha_recoleccion: '2021-05-01', VSIN: 8 },
      { fecha_recoleccion: '2021-06-01', VSIN: 5 },
    ],
  },
  variables: {
    type: Array,
    default: function () {
      return [{ id: 'VSIN', nombre: 'VSIN', color: '#EFEFEF' }]
    },
  },
  titulo_eje_y: {
    type: String,
    default: '',
  },
  titulo_eje_x: {
    type: String,
    default: '',
  },
  nombre_columna_horizontal: String,
  conversionTemporal: {
    type: Function,
    default: () => d3.timeParse('%d-%m-%Y'),
  },
  alto_vis: {
    type: Number,
    default: function () {
      return 400
    },
  },
  ancho_tooltip: {
    type: Number,
    default: 180,
  },
  margin: {
    type: Object,
    default: () => ({ arriba: 10, abajo: 60, izquierda: 50, derecha: 20 }),
  },
})

const { datos, variables, margin } = toRefs(props)

const tooltip_data_seleccionada = ref({})

const claves = ref([])

const svg = ref({})
const grupo_contenedor = ref({})
const grupo_frente = ref({})
const grupo_fondo = ref({})
const grupo_contenedor_ejes = ref({})

const xLabel = ref({})
const yLabel = ref({})

const width = ref(100)
const height = ref(100)

const xScale = ref({})
const yScale = ref({})

const tooltip = ref({})

const grupos_lineas = ref({})

const xAxis = ref({})
const yAxis = ref({})

function configurandoDimensionesParaSVG() {
  /**
   * Método para configurar las dimensiones del elemento SVG
   */

  width.value =
    document.querySelector(`#${props.multilineas_id}`).clientWidth -
    margin.value.derecha -
    margin.value.izquierda

  height.value = props.alto_vis - margin.value.arriba - margin.value.abajo

  svg.value
    .attr('width', width.value + margin.value.derecha + margin.value.izquierda)
    .attr('height', height.value + margin.value.arriba + margin.value.abajo)
  // .style('background-color', '#efefef99') // Comentar fondo

  grupo_contenedor.value.attr(
    'transform',
    `translate(${margin.value.izquierda},${margin.value.arriba})`
  )
  grupo_frente.value.attr(
    'transform',
    `translate(${margin.value.izquierda},${margin.value.arriba})`
  )
}
function configurandoDimensionesParaLinea() {
  /**
   * Método para configurar dimensiones para líneas
   */
  datos.value.forEach(d => {
    d.fech = props.conversionTemporal(d[props.nombre_columna_horizontal])
  })
  // Construyendo escalas
  // Build X scale -> it is temporal or date format
  xScale.value = d3
    .scaleTime()
    .domain(d3.extent(datos.value.map(d => d.fech)))
    .range([0, width.value])

  claves.value = variables.value.map(d => d.id)
  // Build Y scale -> it is linear
  if (claves.value.length !== 0) {
    yScale.value = d3
      .scaleLinear()
      .domain([
        d3.min(datos.value.map(d => d3.min(claves.value.map(dd => d[dd])))),
        d3.max(datos.value.map(d => d3.max(claves.value.map(dd => d[dd])))),
      ])
      .range([height.value, 0])
  } else {
    yScale.value = d3.scaleLinear().domain([0, 0]).range([height.value, 0])
  }
  // Building axis
  // Draw X axis
  xAxis.value
    .attr(
      'transform',
      `translate(${margin.value.izquierda}, ${
        height.value + margin.value.arriba
      })`
    )
    .call(
      d3
        .axisBottom(xScale.value)
        .ticks(5)
        .tickFormat(multiFormat)
        .tickSizeOuter(0)
    )
  xAxis.value
    .selectAll('line')
    .attr('y1', -height.value)
    .style('stroke-dasharray', '3 2 ')
    .style('color', '#EFEFEF')
    .style('stroke-opacity', 0.3)
  xAxis.value.selectAll('text').style('dominant-baseline', 'middle')
  // Línea extra vertical hasta la derecha
  xAxis.value
    .append('g')
    .attr('class', 'grid-x')
    .call(
      d3
        .axisBottom(xScale.value)
        .tickSize(-height.value, 0, 0)
        .tickFormat('')
        .ticks(0)
    )
    .style('opacity', '0.3')
    .style('color', '#efefef')
  // Draw Y axis
  yAxis.value
    .attr(
      'transform',
      `translate(${margin.value.izquierda}, ${margin.value.arriba})`
    )
    .call(d3.axisLeft(yScale.value).ticks(4).tickSizeOuter(0))
  yAxis.value
    .selectAll('line')
    .attr('x2', width.value)
    .style('stroke-dasharray', '3 2 ')
    .style('color', '#EFEFEF')
    .style('stroke-opacity', 0.3)
  // Línea extra horizontal hasta arriba
  yAxis.value
    .append('g')
    .attr('class', 'grid-y')
    .call(
      d3
        .axisLeft(yScale.value)
        .tickSize(-width.value, 0, 0)
        .tickFormat('')
        .ticks(0)
    )
    .style('opacity', '0.3')
    .style('color', '#efefef')

  // Building text labels
  // Adding label X
  xLabel.value
    .attr(
      'transform',
      `translate(${width.value * 0.5}, ${
        height.value + margin.value.abajo - margin.value.arriba
      })`
    )
    .text(props.titulo_eje_x)
    .style('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('font-weight', '600')
    // .style('dominant-baseline', 'hanging')
    .style('color', '#efefef')
  // Adding label Y
  yLabel.value
    .attr('transform', `translate(0, ${height.value * 0.5}) rotate(-90)`)
    .text(props.titulo_eje_y)
    .style('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('font-weight', '600')
    .style('dominant-baseline', 'hanging')
    .style('color', '#efefef')
}
function mostrarTooltip(evento) {
  /**
   * Método para desplegar el tooltip individual
   */
  let bisecetDate = d3.bisector(d => d.fech).left
  let x0 = xScale.value.invert(evento.layerX - margin.value.izquierda)
  let indice = bisecetDate(datos.value, x0)
  let d0 = datos.value[indice - 1]
  let d1 = datos.value[indice]
  if ((d0 !== undefined) & (d1 !== undefined)) {
    let datum = x0 - d0.fech > d1.fech - x0 ? d1 : d0
    let datos_y = claves.value
      .map(d => [d, datum[d]])
      .sort((a, b) => d3.ascending(a[1], b[1]))

    let bisectCantidad = d3.bisector(d => d).center
    let y0 = yScale.value.invert(evento.layerY - margin.value.arriba)
    let indiceY = bisectCantidad(
      datos_y.map(d => d[1]),
      y0
    )

    tooltip_data_seleccionada.value = {
      fech: datum.fech,
      id: datos_y[indiceY][0],
      cat: datum[datos_y[indiceY][0]],
      ...props.variables.filter(d => d.id === datos_y[indiceY][0])[0],
    }
    // Change tooltip position from cursor depending the hover line
    tooltip.value
      .style('visibility', 'visible')
      .style(
        'left',
        evento.layerX - margin.value.izquierda < 0.6 * width.value
          ? evento.layerX + 10 + 'px'
          : +evento.layerX - props.ancho_tooltip - 20 + 'px'
      )
      .style('top', evento.layerY + 'px')
      .attr('width', props.ancho_tooltip)
      .attr('height', 30)

    let contenido_tooltip = tooltip.value
      .select('div.tooltip-contenido')
      .style('background', tooltip_data_seleccionada.value.color)
      .style('opacity', 0.9)
      .style('border-radius', '8px')
      .style('width', props.ancho_tooltip + 'px')
      .style('padding', '0 3px 0 10px')

    let entidad = variables.value.filter(
      d => d.id === tooltip_data_seleccionada.value.id
    )[0]
    let textoTooltip = `
      <p>variable: ${entidad.nombre}<br/>
        <b>value: ${tooltip_data_seleccionada.value.cat.toLocaleString(
          'en'
        )}</b> <br/>
        date: ${tooltip_data_seleccionada.value.fech
          .toLocaleDateString('en-GB')
          .replaceAll('/', '-')}</p>`

    contenido_tooltip
      .select('div.tooltip-cifras')
      .html(textoTooltip)
      .style('margin', '0')
      .style('padding', '0 0 5px 0')

    contenido_tooltip
      .transition()
      .duration(100)
      .style('background', tooltip_data_seleccionada.value.color)
    tooltip.value
      .style('height', contenido_tooltip.style('height'))
      .style('width', contenido_tooltip.style('width'))
  }
}
function cerrarTooltip() {
  /**
   * Método para esconder el tooltip
   */
  tooltip.value.style('visibility', 'hidden')
}
function creandoLineas() {
  /**
   * Método para crear los paths del área
   */
  // Remove all lines created
  grupo_contenedor.value.selectAll('g.grupos-lineas').remove()
  // Join path with color values
  const grupos_series = grupo_contenedor.value
    .selectAll('grupos-lineas')
    .data(variables.value)
    .enter()
    .append('g')
    .attr('class', 'grupos-lineas')

  grupos_lineas.value = grupos_series
    .style('fill', 'none')
    .style('stroke', d => d.color)
    .style('stroke-width', '1.5px')
    .selectAll('lineas')
    .data(d => {
      return [
        datos.value.map(dd => ({
          fech: dd.fech,
          cat: dd[d.id],
          color: d.color,
          id: d.id,
          resaltado: d.resaltado,
        })),
      ]
    })
    .enter()
    .append('path')
    .attr('class', 'lineas')
  // Event the tooltip
  svg.value
    .on('mousemove', evento => {
      mostrarTooltip(evento)
    })
    .on('click', evento => {
      mostrarTooltip(evento)
    })
    .on('mouseout', cerrarTooltip)
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
function actualizandoLineas() {
  /**
   * Método para actualizar los paths trazados de línea
   */
  grupos_lineas.value.attr('d', dd => {
    return d3
      .line()
      .x(d => xScale.value(d.fech))
      .y(d => yScale.value(d.cat))(dd)
  })
}
function reescalandoPantalla() {
  configurandoDimensionesParaSVG()
  configurandoDimensionesParaLinea()
  actualizandoLineas()
}

onMounted(() => {
  // Asigna elementos a variables
  claves.value = variables.value.map(d => d.id)

  svg.value = d3.select('div#' + props.multilineas_id + ' svg.svg-multilineas')
  grupo_contenedor.value = svg.value.select('g.grupo-contenedor-multilineas')
  grupo_frente.value = svg.value.select('g.grupo-frente')
  grupo_fondo.value = svg.value.select('g.grupo-fondo')

  grupo_contenedor_ejes.value = svg.value.select('g.grupo-contenedor-ejes')

  xAxis.value = grupo_fondo.value.select('g.eje-x')
  yAxis.value = grupo_fondo.value.select('g.eje-y')

  xLabel.value = grupo_contenedor_ejes.value
    .append('text')
    .attr('class', 'label-x')

  yLabel.value = grupo_contenedor_ejes.value
    .append('text')
    .attr('class', 'label-y')

  configurandoDimensionesParaSVG()
  configurandoDimensionesParaLinea()
  creandoLineas()
  actualizandoLineas()

  tooltip.value = d3.select('div#' + props.multilineas_id).select('div.tooltip')

  window.addEventListener('resize', reescalandoPantalla)
})
onUnmounted(() => {
  window.removeEventListener('resize', reescalandoPantalla)
})
watch(variables, () => {
  configurandoDimensionesParaSVG()
  configurandoDimensionesParaLinea()
  creandoLineas()
  actualizandoLineas()
})
watch(datos, () => {
  configurandoDimensionesParaSVG()
  configurandoDimensionesParaLinea()
  creandoLineas()
  actualizandoLineas()
})
watch(margin, () => {
  reescalandoPantalla()
})
</script>

<template>
  <div
    :id="multilineas_id"
    class="contenedor-lineas"
  >
    <div class="contenedor-tooltip-svg">
      <div class="tooltip">
        <div class="tooltip-contenido">
          <div class="contenedor-boton-cerrar">
            <button
              class="boton-cerrar-tooltip"
              @click="cerrarTooltip"
            ></button>
          </div>
          <div class="tooltip-cifras"></div>
        </div>
      </div>
      <svg class="svg-multilineas">
        <g class="grupo-fondo">
          <g class="eje-x"></g>
          <g class="eje-y"></g>
        </g>
        <g class="grupo-contenedor-multilineas"></g>
        <g class="grupo-contenedor-ejes"></g>
        <g class="grupo-frente"></g>
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
div.contenedor-tooltip-svg {
  position: relative;
  svg {
    z-index: 1;
  }

  div.tooltip {
    color: #000;
    font-size: 12px;
    position: absolute;
    z-index: 2;
    visibility: hidden;
  }

  div.tooltip div.tooltip-cifras {
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
