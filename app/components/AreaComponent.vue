<script setup>
import * as d3 from 'd3'
import { onMounted, onUnmounted, ref, toRefs, watch } from 'vue'

const props = defineProps({
  areaId: {
    type: String,
    default: () => `area-${Math.random().toString(36).substring(2)}`
  },
  datos: {
    type: Array,
    default: () => [
      { date: '2021-01-01', value: '30' },
      { date: '2021-02-01', value: '50' },
      { date: '2021-03-01', value: '20' }
    ]
  },
  variables: {
    type: Array,
    default: function () {
      return [{ id: 'value', nombre: 'value', color: '#FFFFFF' }]
    }
  },

  tituloEjeY: {
    type: String,
    default: 'Título eje y'
  },
  tituloEjeX: {
    type: String,
    default: 'Título eje x'
  },
  anchoTooltip: {
    type: Number,
    default: 140
  },
  altoVis: {
    type: Number,
    default: 400
  },
  margin: {
    type: Object,
    default: () => ({
      arriba: 10,
      derecha: 10,
      abajo: 50,
      izquierda: 50
    })
  }
})

const { datos, variables, margin } = toRefs(props)

let svg
let grupoContenedor
let grupoFrente
let grupoFondo
let grupoContenedorEjes

let xLabel
let yLabel
let xAxis
let yAxis

let width = 100
let height = 100

let xScale
let yScale
let dataStack = []

let areaGenerator
let tooltip

let resizeObserver
let areaInteraccion

const areaRef = ref(null)
const tooltipRef = ref(null)

const svgRef = ref(null)
const widthLimit = 769

/**
 * Método para calcular el ancho y alto,
 * actualizar las dimensiones del SVG y posicionar los grupos
 */
function configurarDimensionesSVG() {
  // valida en caso que areaRef o svg sea undefined
  if (!areaRef.value || !svg) return

  width = Math.max(
    0,
    areaRef.value.clientWidth
    - margin.value.derecha
    - margin.value.izquierda
  )
  height = window.innerWidth >= widthLimit
    ? props.altoVis - margin.value.arriba - margin.value.abajo
    : 500 - margin.value.arriba - margin.value.abajo

  svg
    .attr('width', width + margin.value.derecha + margin.value.izquierda)
    .attr('height', height + margin.value.arriba + margin.value.abajo)
    // .style('background-color', '#efefef99') // Comentar fondo

  grupoContenedor.attr(
    'transform',
    `translate(${margin.value.izquierda},${margin.value.arriba})`
  )
  grupoFondo.attr(
    'transform',
    `translate(${margin.value.izquierda},${margin.value.arriba})`
  )
  grupoFrente.attr(
    'transform',
    `translate(${margin.value.izquierda},${margin.value.arriba})`
  )
  grupoContenedorEjes.attr(
    'transform',
    `translate(${margin.value.izquierda}, ${margin.value.arriba})`
  )

  // para el tooltip
  areaInteraccion
    .attr('x', margin.value.izquierda)
    .attr('y', margin.value.arriba)
    .attr('width', width)
    .attr('height', height)
}

/**
 * Método para confirmar que los datos son de objeto fecha,
 * filtrar los que estén en NaN y ordenarlos por fecha cronológicamente
 */
function prepararDatos() {
  return datos.value
    .map(d => ({
      ...d,
      date: d.date instanceof Date
        ? d.date
        : new Date(d.date)
    }))
    .filter(d => !Number.isNaN(d.date.getTime()))
    .sort((a, b) => a.date - b.date)
}

/**
 * Método para configurar dimensiones para la gráfica de área
 */
function configurarArea() {
  // ordenando datos
  const datosOrdenados = prepararDatos()

  // Apilando datos
  dataStack = d3
    .stack()
    .keys(variables.value.map(d => d.id))(datosOrdenados)

  // Construyendo escalas
  const maximo = d3.max(
    datosOrdenados,
    d => d3.sum(variables.value, (variable) => {
      const valor = Number(d[variable.id])
      return Number.isFinite(valor) ? valor : 0
    })
  ) || 0

  // Build Y scale -> it is linear
  yScale = d3
    .scaleLinear()
    .domain([0, maximo])
    .range([height, 0])
    .nice()

  const dominioX = d3.extent(datosOrdenados, d => d.date)
  // Build X scale -> it is a date format
  xScale = d3
    .scaleTime()
    .domain(dominioX)
    .range([0, width])

  // Asignando las escalas para el área
  areaGenerator = d3
    .area()
    .x(d => xScale(d.data.date))
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]))
    .curve(d3.curveLinear)
}

// Método para traducir el formato de fecha
function multiFormat(date) {
  const locale = d3.timeFormatLocale({
    decimal: ',',
    thousands: '.',
    grouping: [3],
    currency: ['', ' €'],
    // dateTime: '%A, %e %B %Y г. %X',
    dateTime: '%A, %e de %B de %Y, %X',
    // date: '%d.%m.%Y',
    date: '%d/%m/%Y',
    time: '%H:%M:%S',
    // periods: ['AM', 'PM'],
    periods: ['a. m.', 'p. m.'],
    days: [
      'domingo',
      'lunes',
      'martes',
      'miércoles',
      'jueves',
      'viernes',
      'sábado'
    ],
    shortDays: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    months: [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre'
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
      'dic'
    ]
  })

  const formatMillisecond = locale.format('.%L')
  const formatSecond = locale.format(':%S')
  const formatMinute = locale.format('%I:%M')
  const formatHour = locale.format('%I %p')
  const formatDay = locale.format('%a %d')
  const formatWeek = locale.format('%b %d')
  // const formatMonth = locale.format('%b'),
  const formatMonthYear = locale.format('%b/%Y')
  // const formatoMesAnio = locale.format('%b/%Y')
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
 * Método para dibujar ejes (X,Y), etiquetas
 * y aplicar estilos y cuadrícula
 */
function renderizarEjes() {
  // Construyendo ejes
  if (!xScale || !yScale) return

  const colorTexto = '#FFFFFF'
  const colorGrid = 'rgba(255, 255, 255, 0.25)'

  // Eje X
  xAxis
    .attr(
      'transform',
      `translate(0, ${height})`
    )
    .call(
      d3
        .axisBottom(xScale)
        .ticks(width < 500 ? 4 : 6)
        // .ticks(5)
        .tickSizeInner(-height)
        .tickSizeOuter(0)
        .tickPadding(10)
        .tickFormat(multiFormat)
    )

  // Eje Y
  yAxis
    .call(
      d3
        .axisLeft(yScale)
        .ticks(height < 300 ? 4 : 6)
        // .ticks(5)
        .tickSizeInner(-width)
        .tickSizeOuter(0)
        .tickPadding(8)
        .tickFormat(d3.format(',d'))
    )

  // Estilos generales de los textos de ambos ejes
  xAxis
    .selectAll('text')
    .attr('fill', colorTexto)
    .style('font-size', '11px')

  yAxis
    .selectAll('text')
    .attr('fill', colorTexto)
    .style('font-size', '11px')

  // Líneas principales de los ejes
  xAxis
    .selectAll('.domain')
    .remove()

  yAxis
    .selectAll('.domain')
    .remove()

  // Líneas de cuadrícula del eje X
  xAxis
    .selectAll('.tick line')
    .attr('stroke', colorGrid)
    .attr('stroke-dasharray', '3 2')

  // Líneas de cuadrícula del eje Y
  yAxis
    .selectAll('.tick line')
    .attr('stroke', colorGrid)
    .attr('stroke-dasharray', '3 2')
    // .attr('stroke-opacity', 0.25)

  // Etiqueta del eje X
  xLabel
    .attr(
      'transform',
      `translate(${width / 2}, ${height + margin.value.abajo - 15})`
    )
    .attr('fill', colorTexto)
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('font-weight', '600')
    .text(props.tituloEjeX)

  // Etiqueta del eje Y
  yLabel
    .attr(
      'transform',
      `translate(${-margin.value.izquierda + 15}, ${height / 2}) rotate(-90)`
    )
    .attr('fill', colorTexto)
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('font-weight', '600')
    .text(props.tituloEjeY)
}

/**
 * Método para crear los paths del área
 */
function renderizarArea() {
  grupoContenedor
    .selectAll('path.paths-area')
    .data(dataStack, d => d.key)
    .join(
      // Join path with color values
      enter => enter
        .append('path')
        .attr('class', d => `${d.key} paths-area`)
        .style('fill', (d, i) => variables.value[i].color)
        .style('opacity', 0.8)
        .attr('d', areaGenerator),

      update => update
        .transition()
        .duration(500)
        .style('fill', (d, i) => variables.value[i].color)
        .attr('d', areaGenerator),
      // Remove all area created
      exit => exit.remove()
    )
}

// método para configurar y renderizar todo de un jalón
function renderizarGrafico() {
  configurarDimensionesSVG()
  configurarArea()
  renderizarEjes()
  renderizarArea()
}

/**
 * Método para mostrar el tooltip comparando con el areaInteracción
 * @param evento evento
 */
function mostrarTooltip(evento) {
  if (!xScale || !datos.value.length || !areaInteraccion) return

  const datosOrdenados = prepararDatos()

  if (!datosOrdenados.length) return

  // Coordenadas relativas al SVG completo
  // const [mouseX] = d3.pointer(evento, svg.node())
  const [mouseX, mouseY] = d3.pointer(evento, svg.node())

  // Coordenada relativa al área de dibujo, sin márgenes
  const plotX = mouseX - margin.value.izquierda

  // Evitar que el puntero quede fuera del área útil
  const plotXLimitado = Math.max(0, Math.min(width, plotX))

  // Convertimos la posición horizontal en una fecha
  // const fechaMouse = xScale.invert(mouseX - margin.value.izquierda)
  const fechaMouse = xScale.invert(plotXLimitado)

  // Buscamos la posición más cercana en los datos
  const bisectorDate = d3.bisector(d => d.date).left
  const indice = bisectorDate(datosOrdenados, fechaMouse, 1)

  // Compara los datos anterior y siguiente
  const datoAnterior = datosOrdenados[indice - 1]
  const datoSiguiente = datosOrdenados[indice]

  let datoSeleccionado

  if (!datoAnterior) {
    datoSeleccionado = datoSiguiente
  } else if (!datoSiguiente) {
    datoSeleccionado = datoAnterior
  } else {
    datoSeleccionado
      = fechaMouse - datoAnterior.date
        > datoSiguiente.date - fechaMouse
        ? datoSiguiente
        : datoAnterior
  }

  if (!datoSeleccionado) return

  const contenido = variables.value
    .map((variable) => {
      const valor = Number(datoSeleccionado[variable.id])

      return `
        <p>
          <span
            class="nomenclatura-tooltip"
            style="background: ${variable.color}"
          ></span>
          ${variable.nombre}:
          <b>${Number.isFinite(valor)
            ? valor.toLocaleString('es-MX')
            : '0'}</b>
          <br>
          Fecha:
          ${d3.timeFormat('%d/%m/%Y')(datoSeleccionado.date)}
        </p>
      `
    })
    .join('')

  tooltip
    .select('.tooltip-cifras')
    .html(contenido)

  // Mostrar temporalmente para poder medir sus dimensiones
  tooltip.style('visibility', 'hidden')

  const tooltipNode = tooltip.node()
  const tooltipWidth = tooltipNode?.offsetWidth || props.anchoTooltip
  const tooltipHeight = tooltipNode?.offsetHeight || 0

  // El tooltip se posiciona con coordenadas del SVG exterior
  // Posición horizontal del tooltip
  let posicionLeft = mouseX + 20
  if (posicionLeft + tooltipWidth > width + margin.value.izquierda) {
    posicionLeft = mouseX - tooltipWidth - 20
  }

  // Posición vertical del tooltip
  let posicionTop = mouseY - tooltipHeight - 10
  if (posicionTop < margin.value.arriba) {
    posicionTop = mouseY + 20
  }

  tooltip
    .style('left', `${posicionLeft}px`)
    .style('top', `${posicionTop}px`)
    .style('visibility', 'visible')
}

/**
 * Método para desaparecer el tooltip
 */
function cerrarTooltip() {
  if (!tooltip) return
  tooltip.style('visibility', 'hidden')
}

// Configura mousemove, click y mouseleave
function configurarEventosTooltip() {
  areaInteraccion
    .on('mousemove', mostrarTooltip)
    // .on('click', mostrarTooltip)
    .on('mouseleave', cerrarTooltip)
}

onMounted(() => {
  // Inicializar selecciones de elementos de D3
  svg = d3.select(svgRef.value)

  grupoContenedor = svg.select('g.grupo-contenedor-area')
  grupoFrente = svg.select('g.grupo-frente')
  grupoFondo = svg.select('g.grupo-fondo')
  grupoContenedorEjes = svg.select('g.grupo-contenedor-ejes')

  xAxis = grupoFondo.select('g.eje-x')
  yAxis = grupoFondo.select('g.eje-y')

  areaInteraccion = svg.select('.area-interaccion')

  // tooltip
  tooltip = d3.select(tooltipRef.value)

  xLabel = grupoContenedorEjes
    .append('text')
    .attr('class', 'label-x')

  yLabel = grupoContenedorEjes
    .append('text')
    .attr('class', 'label-y')

  // Dibujar el gráfico
  renderizarGrafico()

  // Activar el tooltip
  configurarEventosTooltip()

  // ResizeObserver detecta cambios en el contenedor aunque no provengan directamente del tamaño de la ventana
  resizeObserver = new ResizeObserver(() => {
    renderizarGrafico()
  })
  resizeObserver.observe(areaRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  svg?.selectAll('*').interrupt()
})

watch([datos, variables, margin],
  () => {
    if (!svg) return
    cerrarTooltip()
    renderizarGrafico()
  },
  {
    deep: true,
    flush: 'post'
  }
)
</script>

<template>
  <div
    :id="areaId"
    ref="areaRef"
    class="contenedor-area"
  >
    <svg
      ref="svgRef"
      class="svg-area"
    >
      <g class="grupo-fondo">
        <g class="eje-x" />
        <g class="eje-y" />
      </g>

      <g class="grupo-contenedor-area" />
      <g class="grupo-contenedor-ejes" />
      <g class="grupo-frente" />

      <rect class="area-interaccion" />
    </svg>

    <div class="contenedor-tooltip">
      <div
        ref="tooltipRef"
        class="tooltip"
      >
        <div class="tooltip-contenido">
          <div class="tooltip-cifras" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
rect.area-interaccion {
  fill: transparent;
  pointer-events: all;
}

.contenedor-area {
  position: relative;
  width: 100%;
  overflow: hidden; // evita que el tooltip cree scroll
}

.svg-area {
  display: block;
  width: 100%;
  position: relative;
  z-index: 1;
}

.contenedor-tooltip {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  overflow: visible;
}

.tooltip {
  position: absolute;
  visibility: hidden;
  color: #fff;
  font-size: 12px;
  pointer-events: none;
  white-space: nowrap;
}

.tooltip-contenido {
  background: rgba(0, 0, 0, 0.85);
  border-radius: 8px;
  width: max-content;
  max-width: 240px;
  padding: 5px 8px;
}

.tooltip-cifras {
  padding-bottom: 5px;

  p {
    margin: 3px;
  }

  .nomenclatura-tooltip {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: solid 1px rgba(255, 255, 255, 0.7);
    display: inline-block;
  }
}
</style>
