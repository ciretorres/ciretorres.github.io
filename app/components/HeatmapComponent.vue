<script setup>
import * as d3 from 'd3'
import {
  ref,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount
} from 'vue'

/**
 * Propiedades del componente
 * @property {String} mapaCalorId
 * @property {Array} data
 * @property {String} titulo
 * @property {[Number, String]} anchoVis
 * @property {Number} altoVis
 * @property {String} tituloEjeX
 * @property {String} tituloEjeY
 * @property {Object} margen: reservan espacio para el título, ejes, etiquetas y contenido ppal
 */
const props = defineProps({
  mapaCalorId: {
    type: String,
    default: () => `mapacalorid-${Math.random().toString(36).substring(2)}`
  },
  data: {
    type: Array,
    default: () => [
      {
        estado: 'Activo',
        tipo_variante: 'Delta',
        cantidad_muestras: 25
      },
      {
        estado: 'Activo',
        tipo_variante: 'Ómicron',
        cantidad_muestras: 40
      },
      {
        estado: 'Activo',
        tipo_variante: 'Delta',
        cantidad_muestras: 10
      },
      {
        estado: 'Activo',
        tipo_variante: 'Delta',
        cantidad_muestras: 15
      }
    ]
  },

  titulo: {
    type: String,
    default:
      'Mapa de calor de muestras por estado y tipo de variante'
  },

  fileName: {
    type: String,
    default: 'heatmap'
  },

  anchoVis: {
    type: [Number, String],
    default: 650
  },
  altoVis: {
    type: Number,
    default: 500
  },

  margen: {
    type: Object,
    default: () => ({
      top: 70,
      right: 30,
      bottom: 80,
      left: 100
    })
  },

  tituloEjeX: {
    type: String,
    default: 'Estados'
  },
  tituloEjeY: {
    type: String,
    default: 'Tipos de variante'
  }
})

// referencias al DOM
const svgRef = ref(null)
const contenedorRef = ref(null)

const anchoReal = ref(650)
const rotarEtiquetas = ref(false)

let resizeObserver = null

// Puntos del dominio y colores correspondientes
const dominioColor = [1, 20, 40, 60, 80]

const rangoColor = [
  '#fff7bc',
  '#fec44f',
  '#fe9929',
  '#d95f0e',
  '#993404'
]
// escala de gris
// const rangoColor = [
//   '#f0f0f0',
//   '#d9d9d9',
//   '#bdbdbd',
//   '#969696',
//   '#737373',
//   '#525252',
// ]

// Color específico para valores igual a cero
const colorCero = '#f3f4f6'

function obtenerMargen() {
  return {
    top: 70,
    right: 30,
    bottom: 80,
    left: 100,
    ...props.margen
  }
}

/**
 * Método para combinar registros repetidos o que tiene
 * el mismo estado y tipo_variante o key
 * @param data
 * @returns {Array}
 */
function agruparDatos(data) {
  const agrupado = new Map()

  for (const item of data) {
    const estado = String(item.estado ?? '').trim()
    const tipoVariante = String(item.tipo_variante ?? '' ).trim()

    if (!estado || !tipoVariante) {
      continue
    }

    const cantidad = Number(item.cantidad_muestras) || 0

    // creando key con los datos de estado y tipo_variante
    // 32 estados por 5 variantes: 160 keys
    const key = `${estado}__${tipoVariante}`

    if (agrupado.has(key)) {
      // añade a la suma de cantidad la cantidad_muestra de la misma key
      agrupado.get(key).cantidad += cantidad
    } else {
      // si la key no existe, creala e inicializa con las
      // propiedades cantidad con cantidad_muestras
      agrupado.set(key, {
        estado,
        tipo_variante: tipoVariante,
        cantidad
      })
    }
  }

  // un nuevo arreglo con estado, tipo_variante y cantidad
  return [...agrupado.values()]
}

/**
 * Genera todas las combinaciones entre estados y tipos.
 *
 * Si una combinación no existe en los datos agrupados,
 * se crea con cantidad igual a 0.
 * @param datosAgrupados
 * @returns
 */
function completarCombinaciones(datosAgrupados) {
  // remueve valores repetidos y obtiene valores únicos
  // con Set y ordénalos
  const estados = [
    ...new Set( datosAgrupados.map(item => item.estado) )
  ].sort((a, b) => a.localeCompare(b))

  const tipos = [
    ...new Set( datosAgrupados.map(item => item.tipo_variante) )
  ].sort((a, b) => a.localeCompare(b))

  const datosPorClave = new Map(
    datosAgrupados.map(item => [
      `${item.estado}__${item.tipo_variante}`,
      item
    ])
  )

  const datosCompletos = []

  for (const tipo of tipos) {
    for (const estado of estados) {
      const key = `${estado}__${tipo}`
      const datoExistente = datosPorClave.get(key)

      datosCompletos.push({
        estado,
        tipo_variante: tipo,
        cantidad: datoExistente?.cantidad ?? 0
      })
    }
  }

  return {
    datos: datosCompletos,
    estados,
    tipos
  }
}

function obtenerAncho() {
  const anchoContenedor = contenedorRef.value?.clientWidth || 900

  if (typeof props.anchoVis === 'number') {
    return Math.max(props.anchoVis, 650)
  }

  return Math.max(anchoContenedor, 650)
}

function detectarRotacion(estados, escalaX) {
  if (!estados.length) {
    rotarEtiquetas.value = false
    return
  }

  const anchoBanda = escalaX.bandwidth()

  rotarEtiquetas.value = estados.some(estado => {
    const texto = String(estado).trim()
    const anchoTextoEstimado = texto.length * 7

    return (
      texto.length > 12 ||
      anchoTextoEstimado > anchoBanda
    )
  })
}


function descargarArchivo(contenido, nombre, tipo) {
  const blob = new Blob([contenido], {
    type: tipo
  })

  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')

  enlace.href = url
  enlace.download = nombre
  enlace.click()

  URL.revokeObjectURL(url)
}

function prepararSvgParaExportar() {
  if (!svgRef.value) {
    return null
  }

  const svgOriginal = svgRef.value
  const svgClonado = svgOriginal.cloneNode(true)

  svgClonado.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svgClonado.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')

  svgClonado.setAttribute('width', anchoReal.value)
  svgClonado.setAttribute('height', props.altoVis)

  svgClonado.setAttribute('viewBox', `0 0 ${anchoReal.value} ${props.altoVis}`)

  const estilos = document.createElementNS('http://www.w3.org/2000/svg', 'style')

  estilos.textContent = `
    text {
      font-family: Arial, sans-serif;
    }
    .titulo,
    .etiqueta-eje-horizontal,
    .etiqueta-eje-vertical,
    .eje-horizontal text,
    .eje-vertical text {
      fill: #374151;
    }
    .eje-horizontal,
    .eje-vertical {
      color: #374151;
    }
    .celda {
      stroke: none;
    }
    .valor {
      user-select: none;
    }
  `

  svgClonado.insertBefore( estilos, svgClonado.firstChild )

  return svgClonado
}

function exportarSVG() {
  const svg = prepararSvgParaExportar()

  if (!svg) {
    return
  }

  const contenido = new XMLSerializer().serializeToString(svg)

  descargarArchivo(
    contenido,
    `${props.fileName}.svg`,
    'image/svg+xml;charset=utf-8'
  )
}

function crearCanvasDesdeSVG() {
  return new Promise((resolve, reject) => {
    const svg = prepararSvgParaExportar()

    if (!svg) {
      reject(
        new Error('El SVG no está disponible')
      )
      return
    }

    const contenido = new XMLSerializer().serializeToString(svg)

    const blob = new Blob([contenido], { type: 'image/svg+xml;charset=utf-8' })

    const url = URL.createObjectURL(blob)
    const imagen = new Image()

    imagen.onload = () => {
      const escala = 2

      const canvas = document.createElement('canvas')

      canvas.width = anchoReal.value * escala
      canvas.height = props.altoVis * escala

      const contexto = canvas.getContext('2d')

      contexto.fillStyle = '#ffffff'
      contexto.fillRect(0, 0, canvas.width, canvas.height)

      contexto.scale(escala, escala)

      contexto.drawImage( imagen, 0, 0, anchoReal.value, props.altoVis )

      URL.revokeObjectURL(url)
      resolve(canvas)
    }

    imagen.onerror = error => {
      URL.revokeObjectURL(url)
      reject(error)
    }

    imagen.src = url
  })
}

async function exportarPNG() {
  try {
    const canvas = await crearCanvasDesdeSVG()

    canvas.toBlob(blob => {
      if (!blob) {
        return
      }

      const url = URL.createObjectURL(blob)
      const enlace = document.createElement('a')

      enlace.href = url
      enlace.download = `${props.fileName}.png`
      enlace.click()

      URL.revokeObjectURL(url)
    }, 'image/png')
  } catch (error) {
    console.error('No se pudo exportar el PNG:', error)
  }
}

async function exportarPDF() {
  try {
    const { jsPDF } = await import('jspdf')
    const canvas = await crearCanvasDesdeSVG()

    const imagenPNG = canvas.toDataURL('image/png')

    const pdf = new jsPDF({
      orientation: anchoReal.value > props.altoVis ? 'landscape' : 'portrait',
      unit: 'px',
      format: [ anchoReal.value, props.altoVis ]
    })

    pdf.addImage( imagenPNG, 'PNG', 0, 0, anchoReal.value, props.altoVis )

    pdf.save(`${props.fileName}.pdf`)
  } catch (error) {
    console.error('No se pudo exportar el PDF:', error)
  }
}

function dibujarHeatmap() {
  // valida que existan las referencias
  if (!svgRef.value || !contenedorRef.value) {
    return
  }

  const margen = obtenerMargen()
  // selecciona el svg
  const svg = d3.select(svgRef.value)
  // remueve todo el contenido del gráfico anterior dibujado
  svg.selectAll('*').remove()

  anchoReal.value = obtenerAncho()

  // Agrupa los datos sumando la cantidad de muestras
  const datosAgrupados = agruparDatos(props.data)
  // completando datos con cantidad en 0
  const resultado = completarCombinaciones(
    datosAgrupados
  )

  const datos = resultado.datos
  const estados = resultado.estados
  const tipos = resultado.tipos

  const alto = props.altoVis

  // calcular tamaño del contenedor
  const anchoInterior = Math.max(
    anchoReal.value -
      margen.left -
      margen.right,
    100
  )
  let altoInterior = Math.max(
    alto -
      margen.top -
      margen.bottom,
    100
  )

  // configuración accesible y dimensiones svg
  svg
    .attr('width', anchoReal.value)
    .attr('height', alto)
    .attr('viewBox', `0 0 ${anchoReal.value} ${alto}`)
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('role', 'img')
    .attr('aria-label', props.titulo)

  // si no hay datos agrega y muestra este texto
  if (!datos.length) {
    svg
      .append('text')
      .attr('x', anchoReal.value / 2)
      .attr('y', alto / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#6b7280')
      .style('font-size', '16px')
      .text('No hay datos para mostrar')

    return
  }

  // Dominio de ejes
  // Escalas
  const escalaXInicial = d3
    .scaleBand()
    .domain(estados)
    .range([0, anchoInterior])
    .padding(0.08)

  detectarRotacion(
    estados,
    escalaXInicial
  )

  if (rotarEtiquetas.value) {
    altoInterior = Math.max(
      alto -
        margen.top -
        margen.bottom -
        35,
      100
    )
  }

  const escalaX = d3
    .scaleBand()
    .domain(estados)
    .range([0, anchoInterior])
    .padding(0.08)

  const escalaY = d3
    .scaleBand()
    .domain(tipos)
    .range([0, altoInterior])
    .padding(0.08)

  // Cálculando el valor máximod de cantidad en los datos
  const maximo =
    d3.max(datos, item => item.cantidad) || 80

  const escalaColor = d3
    .scaleLinear()
    .domain(dominioColor)
    .range(rangoColor)
    .clamp(true)

  const grupo = svg
    .append('g')
    .attr(
      'transform',
      `translate(${margen.left}, ${margen.top})`
    )

  // Contrucción de los ejes
  // eje horizontal o abajo: estados
  const ejeX = grupo
    .append('g')
    .attr('class', 'eje-horizontal')
    .attr(
      'transform',
      `translate(0, ${altoInterior})`
    )
    .attr('color', 'white')
    .call(
      d3.axisBottom(escalaX)
      // remueve palitos y líneas de los ejes
      .tickSize(0)
    )
  // Eliminar solamente la línea del eje,
  // pero conservar el grupo completo
  ejeX.select('.domain').remove()

  if (rotarEtiquetas.value) {
    ejeX
      .selectAll('.tick text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-0.6em')
      .attr('dy', '0.15em')
  }

  // eje vertical o izquierdo: tipos de variante
  const ejeY = grupo
    .append('g')
    .attr('class', 'eje-vertical')
    .attr('color', 'white')
    .call(
      d3.axisLeft(escalaY).tickSize(0)
    )
  ejeY.select('.domain').remove()

  // Contrucción de etiquetas
  // etiqueta del eje horizontal
  grupo
    .append('text')
    .attr('class', 'etiqueta-eje-horizontal')
    .attr('x', anchoInterior / 2)
    .attr(
      'y',
      altoInterior +
        (rotarEtiquetas.value ? 85 : 55)
    )
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .style('font-size', '14px')
    .text(props.tituloEjeX)
  // etiqueta del eje vertical
  grupo
    .append('text')
    .attr('class', 'etiqueta-eje-vertical')
    .attr('transform', 'rotate(-90)')
    .attr('x', -altoInterior / 2)
    .attr('y', -85)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .style('font-size', '14px')
    .text(props.tituloEjeY)

  /*
   * Creando celdas del heatmap desde el grupo
   */
  const celdas = grupo
    .selectAll('.celda')
    .data(
      datos,
      item =>
        `${item.estado}__${item.tipo_variante}`
    )
    .join('rect')
    .attr('class', 'celda')
    .attr('x', item => escalaX(item.estado))
    .attr('y', item => escalaY(item.tipo_variante))
    .attr('width', escalaX.bandwidth())
    .attr('height', escalaY.bandwidth())
    // .attr('rx', 4)
    .attr( 'fill',
      item =>
        item.cantidad === 0
          ? colorCero
          : escalaColor(item.cantidad)
    )

  /*
   * Tooltip nativo del navegador
   * El navegador lo muestra como tooltip al colocar
   * el cursor sobre la celda
   */
  celdas
    .append('title')
    .text(item => {
      return [
        `Estado: ${item.estado}`,
        `Tipo: ${item.tipo_variante}`,
        `Muestras: ${item.cantidad}`
      ].join('\n')
    })
  // Colocando Valores dentro de las celdas
  grupo
    .selectAll('.valor')
    .data(
      datos,
      item =>
        `${item.estado}__${item.tipo_variante}`
    )
    .join('text')
    .attr('class', 'valor')
    // centradas
    .attr(
      'x',
      item =>
        escalaX(item.estado) +
        escalaX.bandwidth() / 2
    )
    .attr(
      'y',
      item =>
        escalaY(item.tipo_variante) +
        escalaY.bandwidth() / 2
    )
    .attr('text-anchor', 'middle')
    .attr(
      'dominant-baseline',
      'middle'
    )
    // El color del texto cambia según el valor
    .attr(
      'fill',
      item =>
        item.cantidad > maximo * 0.55
          ? 'white'
          : 'black'
    )
    .style('font-size', '12px')
    .style('pointer-events', 'none')
    .text(item => item.cantidad)

  // Agregando Título del gráfico
  svg
    .append('text')
    .attr('class', 'titulo')
    .attr('x', margen.left)
    .attr('y', 28)
    .attr('fill', 'white')
    .style('font-size', '18px')
    .style('font-weight', '600')
    .text(props.titulo)
}

watch(
  [
    () => props.data,
    () => props.anchoVis,
    () => props.altoVis,
    () => props.margen,
    () => props.titulo,
    () => props.tituloEjeX,
    () => props.tituloEjeY
  ],
  () => {
    nextTick(() => {
      dibujarHeatmap()
    })
  },
  {
    // permite detectar cambios dentro de los objetos del arreglo
    deep: true
  }
)

onMounted(() => {
  dibujarHeatmap()

  // Redimensionamiento
  resizeObserver = new ResizeObserver(() => {
    dibujarHeatmap()
  })

  // Observa y responde a cambios en el tamaño del contenedor
  if (contenedorRef.value) {
    resizeObserver.observe( contenedorRef.value )
  }
})

// Limpieza del componente
onBeforeUnmount(() => {
  // Cuando el componente se elimina, se desconecta el observador.
  // Esto evita fugas de memoria y callbacks ejecutándose sobre un componente que ya no existe.
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<template>
  <div
    :id="mapaCalorId"
    ref="contenedorRef"
    class="heatmap-wrapper"
  >
    <div class="heatmap-toolbar">
      <button type="button" @click="exportarSVG" >
        Exportar SVG
      </button>

      <button type="button" @click="exportarPNG" >
        Exportar PNG
      </button>

      <button type="button" @click="exportarPDF" >
        Exportar PDF
      </button>
    </div>

    <!-- D3 necesita que el SVG exista en el navegador -->
    <div class="heatmap-container">
      <!-- eslint-disable-next-line -->
      <svg ref="svgRef"></svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.heatmap-wrapper {
  width: 100%;
}

.heatmap-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.heatmap-toolbar button {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  font-size: 14px;
}

.heatmap-toolbar button:hover {
  background: #f3f4f6;
}

.heatmap-container {
  width: 100%;
  overflow-x: auto;
}

.heatmap-container svg {
  display: block;
  min-width: 650px;
  color: #374151;
}

.celda {
  cursor: pointer;
}

.celda:hover {
  stroke: #111827;
  stroke-width: 2;
}

.valor {
  user-select: none;
}
</style>
