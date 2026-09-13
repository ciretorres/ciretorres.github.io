<script setup>
import * as d3 from 'd3'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  multilineasId: {
    type: String,
    default: () => `multilineasid-${Math.random().toString(36).substring(2)}`,
  },
  datos: {
    type: Array,
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
    default: () => [{ id: 'VSIN', nombre: 'VSIN', color: '#EFEFEF' }],
  },
  nombreColumnaHorizontal: {
    type: String,
    required: true,
  },
  conversionTemporal: {
    type: Function,
    default: () => d3.timeParse('%Y-%m-%d'),
  },
  tituloEjeX: {
    type: String,
    default: '',
  },
  tituloEjeY: {
    type: String,
    default: '',
  },
  altoVis: {
    type: Number,
    default: 400,
  },
  anchoTooltip: {
    type: Number,
    default: 180,
  },
  margin: {
    type: Object,
    default: () => ({ arriba: 10, abajo: 60, izquierda: 50, derecha: 20 }),
  },
})

const containerRef = ref(null)
const tooltipRef = ref(null)
const svgRef = ref(null)

let svg
let chartGroup

let axisGroup
let xAxisGroup
let yAxisGroup
let gridXGroup
let gridYGroup

let resizeObserver

const width = ref(0)
const height = ref(0)
const xScale = ref(null)
const yScale = ref(null)

/**
 * Método para renombrar la fecha_recoleccion a solo fecha
 * y ordenarlos cronológicamente
 */
const puntos = computed(() => {
  return props.datos
    .map(dato => ({
      ...dato,
      fecha: props.conversionTemporal(
        dato[props.nombreColumnaHorizontal],
      ),
    }))
    .filter(({ fecha }) => {
      return fecha instanceof Date
        && !Number.isNaN(fecha.getTime())
    })
    .sort((a, b) => a.fecha - b.fecha)
})

const idsVariables = computed(() => {
  return props.variables.map(variable => variable.id)
})

/**
 * Método para configurar dimensiones para el svg
 */
function calcularDimensiones() {
  const containerWidth = containerRef.value?.clientWidth ?? 0

  width.value = Math.max(
    0,
    containerWidth
      - props.margin.izquierda
      - props.margin.derecha,
  )
  height.value = Math.max(
    0,
    props.altoVis
      - props.margin.arriba
      - props.margin.abajo,
  )

  svg
    .attr('width', width.value + props.margin.izquierda + props.margin.derecha)
    .attr('height', height.value + props.margin.arriba + props.margin.abajo)
  // .style('background-color', '#efefef99') // Comentar fondo
}

/**
 * Método para configurar dimensiones para líneas
 */
function calcularEscalas() {
  if (!puntos.value.length || !idsVariables.value.length) {
    return
  }

  // obtener las fechas
  const fechas = puntos.value.map(d => d.fecha)
  // los valores para esas fechas de cada variante
  const valores = puntos.value.flatMap((dato) => {
    return idsVariables.value
      .map(id => Number(dato[id]))
      .filter(Number.isFinite)
  })

  if (!valores.length) {
    return
  }

  // Construyendo escalas
  // Build X scale -> it is temporal or date format
  xScale.value = d3
    .scaleTime()
    .domain(d3.extent(fechas))
    .range([0, width.value])

  // Build Y scale -> it is linear
  const dominioY = d3.extent(valores)
  // Evita un dominio con la misma cantidad mínima y máxima.
  if (dominioY[0] === dominioY[1]) {
    dominioY[0] -= 1
    dominioY[1] += 1
  }
  yScale.value = d3
    .scaleLinear()
    .domain(dominioY)
    .nice()
    .range([height.value, 0])
}

/**
 * Método para traducir el formato de fecha
 */
function multiFormat(date) {
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

function actualizarEjes() {
  if (!xScale.value || !yScale.value) {
    return
  }

  // Building axis
  // Draw X axis
  xAxisGroup
    .attr(
      'transform',
      `translate(${props.margin.izquierda}, ${props.margin.arriba + height.value})`,
    )
    .call(
      d3.axisBottom(xScale.value)
        // .ticks(5)
        .ticks(Math.max(2, Math.floor(width.value / 100)))
        .tickFormat(multiFormat)
        .tickSizeOuter(0),
    )
  // Draw Y axis
  yAxisGroup
    .attr(
      'transform',
      `translate(${props.margin.izquierda}, ${props.margin.arriba})`,
    )
    .call(
      d3.axisLeft(yScale.value)
        .ticks(5)
        .tickSizeOuter(0),
    )

  gridXGroup
    .attr(
      'transform',
      `translate(${props.margin.izquierda}, ${props.margin.arriba + height.value})`,
    )
    .call(
      d3.axisBottom(xScale.value)
        .ticks(5)
        .tickSize(-height.value)
        .tickFormat(''),
    )

  gridYGroup
    .attr('transform', `translate(${props.margin.izquierda}, ${props.margin.arriba})`)
    .call(
      d3.axisLeft(yScale.value)
        .ticks(5)
        .tickSize(-width.value)
        .tickFormat(''),
    )

  axisGroup
    .selectAll('.domain')
    .attr('stroke', 'currentColor')

  // Estilos generales de los grid de ambos ejes
  axisGroup
    .selectAll('.tick line')
    .style('stroke-dasharray', '3 2 ')
    .style('color', '#EFEFEF')
    .style('stroke-opacity', 0.3)

  axisGroup
    .selectAll('.tick text')
    .attr('font-size', 11)
}

/**
 * Método para crear y actualizar los paths trazados de línea
 */
function actualizarLineas() {
  if (!xScale.value || !yScale.value) {
    return
  }

  const line = d3
    .line()
    .defined(d => Number.isFinite(Number(d.valor)))
    .x(d => xScale.value(d.fecha))
    .y(d => yScale.value(Number(d.valor)))

  const series = props.variables.map(variable => ({
    ...variable,
    valores: puntos.value.map(dato => ({
      fecha: dato.fecha,
      valor: dato[variable.id],
    })),
  }))

  chartGroup
    .selectAll('g.grupo-linea')
    .data(series, d => d.id)
    .join(
      enter => {
        const grupo = enter
          .append('g')
          .attr('class', 'grupo-linea')

        grupo
          .append('path')
          .attr('class', 'linea')

        return grupo
      },
      update => update,
      exit => exit.remove(),
    )
    .attr('color', d => d.color)
    .select('path')
    .attr('fill', 'none')
    .attr('stroke', d => d.color)
    .attr('stroke-width', 1.5)
    .attr('d', d => line(d.valores))
}

// método para configurar y renderizar todo de un jalón
function renderizar() {
  if (!svg || !containerRef.value) {
    return
  }

  calcularDimensiones()
  calcularEscalas()
  actualizarEjes()
  actualizarLineas()
}

function posicionarTooltip(tooltip, mouseX, mouseY) {
  const tooltipNode = tooltip.node()
  const containerNode = containerRef.value

  if (!tooltipNode || !containerNode) {
    return
  }

  const separacion = 12

  // El tooltip debe estar visible antes de calcular su tamaño.
  tooltip.style('visibility', 'visible')

  const anchoTooltip = tooltipNode.offsetWidth
  const altoTooltip = tooltipNode.offsetHeight
  const anchoContenedor = containerNode.clientWidth
  const altoContenedor = containerNode.clientHeight

  // Posición horizontal del tooltip
  let left = mouseX + separacion
  // Posición vertical del tooltip
  let top = mouseY + separacion

  // Si no cabe a la derecha, se coloca a la izquierda.
  if (left + anchoTooltip > anchoContenedor) {
    left = mouseX - anchoTooltip - separacion
  }

  // Evita que se salga por la izquierda.
  if (left < 4) {
    left = 4
  }

  // Evita que se salga por la derecha.
  if (left + anchoTooltip > anchoContenedor) {
    left = anchoContenedor - anchoTooltip - 4
  }

  // Si no cabe debajo del cursor, se coloca arriba.
  if (top + altoTooltip > altoContenedor) {
    top = mouseY - altoTooltip - separacion
  }

  // Evita que se salga por arriba.
  if (top < 4) {
    top = 4
  }

  tooltip
    .style('left', `${left}px`)
    .style('top', `${top}px`)
}

// Método para desaparecer el tooltip
function ocultarTooltip() {
  if (!tooltipRef.value) {
    return
  }

  d3.select(tooltipRef.value)
    .style('visibility', 'hidden')
}

/**
 * Método para mostrar el tooltip comparando con el areaInteracción
 * @param event evento
 */
function mostrarTooltip(event) {
  if (!xScale.value || !yScale.value || !puntos.value.length || !tooltipRef.value) {
    return
  }

  // Coordenadas relativas al SVG completo
  const [mouseX, mouseY] = d3.pointer(event, svg.node())

  // Convertimos la posición horizontal en una fecha
  const fechaMouse = xScale.value.invert(
    mouseX - props.margin.izquierda,
  )

  // Buscamos la posición más cercana en los datos
  const bisectorDate = d3.bisector(d => d.fecha).left
  const index = bisectorDate(puntos.value, fechaMouse)

  let dato

  if (index <= 0) {
    dato = puntos.value[0]
  }
  else if (index >= puntos.value.length) {
    dato = puntos.value[puntos.value.length - 1]
  }
  else {
    // Compara los datos anterior y siguiente
    const anterior = puntos.value[index - 1]
    const siguiente = puntos.value[index]

    dato =
      fechaMouse - anterior.fecha
        <= siguiente.fecha - fechaMouse
        ? anterior
        : siguiente
  }

  const tooltip = d3.select(tooltipRef.value)

  const valores = props.variables
    .map(variable => ({
      id: variable.id,
      nombre: variable.nombre ?? variable.id,
      color: variable.color ?? '#333',
      valor: dato[variable.id],
    }))
    .filter(item => {
      return item.valor !== null
        && item.valor !== undefined
        && Number.isFinite(Number(item.valor))
    })

  /*
   * fecha_recoleccion original recibida en el objeto.
   * Por ejemplo: "2021-01-01"
   */
  const fechaOriginal = dato[props.nombreColumnaHorizontal]

  tooltip
    .select('.tooltip-fecha-label')
    .text('Fecha de recolección:')

  tooltip
    .select('.tooltip-fecha-valor')
    .text(fechaOriginal)


  const filas = tooltip
    .select('.tooltip-cifras')
    .selectAll('.tooltip-fila')
    .data(valores, d => d.id)

  const filasEnter = filas
    .enter()
    .append('div')
    .attr('class', 'tooltip-fila')

  filasEnter
    .append('span')
    .attr('class', 'tooltip-color')

  filasEnter
    .append('span')
    .attr('class', 'tooltip-nombre')

  filasEnter
    .append('span')
    .attr('class', 'tooltip-valor')

  filas
    .merge(filasEnter)
    .each(function (d) {
      const fila = d3.select(this)

      fila
        .select('.tooltip-color')
        .style('display', 'inline-block')
        .style('width', '10px')
        .style('height', '10px')
        .style('min-width', '10px')
        .style('border-radius', '50%')
        .style('background-color', d.color)
        .style('margin-right', '6px')

      fila
        .select('.tooltip-nombre')
        .text(`${d.id}:`)

      fila
        .select('.tooltip-valor')
        .text(Number(d.valor).toLocaleString('es-ES'))
    })

  filas.exit().remove()

  // Debe ejecutarse después de agregar la fecha y las filas.
  posicionarTooltip(tooltip, mouseX, mouseY)
}

function inicializar() {
  // Inicializar selecciones de elementos de D3
  svg = d3.select(svgRef.value)

  chartGroup = svg.select('.grupo-contenedor-multilineas')
  axisGroup = svg.select('.grupo-fondo')

  xAxisGroup = svg.select('.eje-x')
  yAxisGroup = svg.select('.eje-y')
  gridXGroup = svg.select('.grid-x')
  gridYGroup = svg.select('.grid-y')

  // el tooltip se hace sensible al svg
  svg
    .on('mousemove.chart', mostrarTooltip)
    .on('mouseleave.chart', ocultarTooltip)

  renderizar()

  resizeObserver = new ResizeObserver(() => {
    renderizar()
  })
  resizeObserver.observe(containerRef.value)
}

onMounted(async () => {
  await nextTick()
  inicializar()
})

watch(
  [
    () => props.datos,
    () => props.variables,
    () => props.margin,
    () => props.altoVis,
  ],
  renderizar,
  { deep: true, flush: 'post' },
)

onUnmounted(() => {
  resizeObserver?.disconnect()
  svg?.on('.chart', null)
})
</script>


<template>
  <div
    :id="multilineasId"
    ref="containerRef"
    class="contenedor-lineas"
  >
    <div class="contenedor-tooltip-svg">
      <div ref="tooltipRef" class="tooltip">
        <button
          class="boton-cerrar-tooltip"
          type="button"
          @click="ocultarTooltip"
        >
          x
        </button>

        <div class="tooltip-fecha" >
          <div class="tooltip-fecha-label"/>
          <div class="tooltip-fecha-valor"/>
        </div>
        <div class="tooltip-cifras" />
      </div>

      <svg
        ref="svgRef"
        class="svg-multilineas"
      >
        <g class="grupo-fondo">
          <g class="grid-x" />
          <g class="grid-y" />
          <g class="eje-x" />
          <g class="eje-y" />
        </g>

        <g
          class="grupo-contenedor-multilineas"
          :transform="`translate(${margin.izquierda}, ${margin.arriba})`"
        />
      </svg>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.contenedor-tooltip-svg {
  position: relative;
  width: 100%;

  .tooltip {
    position: absolute;
    z-index: 10;
    width: max-content;
    min-width: 180px;
    max-width: 280px;
    box-sizing: border-box;
    padding: 8px 10px;
    color: #222;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 3px 12px rgb(0 0 0 / 18%);
    font-size: 12px;
    pointer-events: none;
    visibility: hidden;

    .boton-cerrar-tooltip {
      pointer-events: auto;
      display: block;
      margin-left: auto;
      border: 0;
      background: transparent;
      font-size: 20px;
      cursor: pointer;
    }

    .tooltip-fecha {
      margin-bottom: 6px;
      padding-bottom: 5px;
      border-bottom: 1px solid #ddd;

      .tooltip-fecha-label {
        font-weight: 600;
      }

      .tooltip-fecha-valor {
        margin-top: 2px;
      }
    }
  }
}

.tooltip-fila {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0;
}

.tooltip-color {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.tooltip-nombre {
  margin-right: 4px;
}

.tooltip-valor {
  font-weight: 600;
}
</style>
