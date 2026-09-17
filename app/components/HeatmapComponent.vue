<script setup>
import * as d3 from 'd3'

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
    default: () => `mapacalorid-${Math.random().toString(36).substring(2)}`,
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
    default: 'Mapa de calor de muestras por estado y tipo de variante',
  },
  anchoVis: {
    type: [Number, String],
    default: 650
  },
  altoVis: {
    type: Number,
    default: 500
  },
  tituloEjeX: {
    type: String,
    default: 'Estados',
  },
  tituloEjeY: {
    type: String,
    default: 'Tipos de variante',
  },
  margen: {
    type: Object,
    default: () => ({
      top: 70,
      right: 30,
      bottom: 80,
      left: 100
    })
  }
})

// referencias al DOM
const svgRef = ref(null)
const contenedorRef = ref(null)

let resizeObserver = null

/**
 * Método para combinar registros repetidos o que tiene
 * el mismo estado y tipo_variante o key
 * @param data
 * @returns {Array}
 */
function agruparDatos(data) {
  const agrupado = new Map()

  for (const item of data) {
    // creando key con los datos de estado y tipo_variante
    // 32 estados por 5 variantes: 160 keys
    const key = `${item.estado}__${item.tipo_variante}`

    if (agrupado.has(key)) {
      // añade a la suma de cantidad la cantidad_muestra
      // de la misma key
      agrupado.get(key).cantidad += Number(
        item.cantidad_muestras
      ) || 0
    } else {
      // si la key no existe, creala e inicializa con las
      // propiedades cantidad con cantidad_muestras
      agrupado.set(key, {
        estado: item.estado,
        tipo_variante: item.tipo_variante,
        cantidad: Number(item.cantidad_muestras) || 0
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
 */
function completarCombinaciones(datosAgrupados) {
  const estados = [
    ...new Set(
      datosAgrupados.map(item => item.estado)
    )
  ].sort((a, b) => a.localeCompare(b))
  const tipos = [
    ...new Set(
      datosAgrupados.map(item => item.tipo_variante)
    )
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
        cantidad: datoExistente?.cantidad || 0
      })
    }
  }

  return datosCompletos
}

function dibujarHeatmap() {
  // valida que existan las referencias
  if (!svgRef.value || !contenedorRef.value) {
    return
  }

  // selecciona el svg
  const svg = d3.select(svgRef.value)
  // remueve todo el contenido del gráfico anterior dibujado
  svg.selectAll('*').remove()

  // Agrupa los datos sumando la cantidad de muestras
  const datosAgrupados = agruparDatos(props.data)
  // completando datos con cantidad en 0
  const datos = completarCombinaciones(datosAgrupados)

  // calcular tamaño del contenedor
  // no menor a 650 de ancho y 500 de alto
  const anchoContenedor =
    contenedorRef.value.clientWidth || 900
  const ancho = Math.max(anchoContenedor, 650)
  const alto = props.altoVis

  // calculando área real del dibujo
  const anchoInterior =
    ancho - props.margen.left - props.margen.right
  const altoInterior =
    alto - props.margen.top - props.margen.bottom

  // configuración accesible y dimensiones svg
  svg
    .attr('width', ancho)
    .attr('height', alto)
    .attr('viewBox', `0 0 ${ancho} ${alto}`)
    .attr('role', 'img')
    .attr('aria-label', props.titulo)

  // si no hay datos agrega y muestra este texto
  if (!datos.length) {
    svg
      .append('text')
      .attr('x', ancho / 2)
      .attr('y', alto / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#6b7280')
      .style('font-size', '16px')
      .text('No hay datos para mostrar')
    return
  }

  // Dominio de ejes
  // remueve valores repetidos y obtiene valores únicos
  // con Set y ordénalos
  const estados = [...new Set(
    datos.map(item => item.estado)
  )].sort((a, b) => a.localeCompare(b))
  const tipos = [...new Set(
    datos.map(item => item.tipo_variante)
  )].sort()

  // Escalas
  const escalaX = d3
    // distribuye categorías uniformemente a lo largo del eje
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
  const maximo = d3.max(
    datos,
    item => item.cantidad
  ) || 1
  // crea escala de Color
  // const escalaColor = d3
  //   // os valores bajos reciben colores amarillos claros
  //   // y los valores altos colores naranja o rojo.
  //   .scaleSequential(d3.interpolateYlOrRd)
  //   .domain([0, maximo])
  // escala personalizada con 6 rangos y colores
  const dominioColor = [1, 20, 40, 60, 80]
  const rangoColor =
      [
        '#f0f0f0',
        '#d9d9d9',
        '#bdbdbd',
        '#969696',
        '#737373',
        '#525252',
      ]
  const escalaColor = d3
      .scaleLinear()
      .domain(dominioColor)
      .range(rangoColor)
      .clamp(true)

  // agregando el svg a un grupo
  const grupo = svg
    .append('g')
    .attr(
      'transform',
      `translate(${props.margen.left}, ${props.margen.top})`
    )

  // Contrucción de los ejes
  // eje horizontal o abajo: estados
  grupo
    .append('g')
    .attr('class', 'eje-horizontal')
    .attr(
      'transform',
      `translate(0, ${altoInterior})`
    )
    .attr('color', 'white')
    .call(d3.axisBottom(escalaX)
    // remueve palitos y líneas de los ejes
    .tickSize(0))
    .select('.domain').remove()
  // eje vertical o izquierdo: tipos de variante
  grupo
    .append('g')
    .attr('class', 'eje-vertical')
    .attr('color', 'white')
    .call(d3.axisLeft(escalaY).tickSize(0))
    .select('.domain').remove()

  // Contrucción de etiquetas
  // etiqueta del eje horizontal
  grupo
    .append('text')
    .attr('class', 'etiqueta-eje-horizontal')
    .attr('x', anchoInterior / 2)
    .attr('y', altoInterior + 55)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
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
    .text(props.tituloEjeY)

  /*
   * Creando celdas del heatmap desde el grupo
   */
  const celdas = grupo
    .selectAll('.celda')
    .data(
      datos,
      item => `${item.estado}-${item.tipo_variante}`
    )
    .enter()
    .append('rect')
    .attr('class', 'celda')
    .attr( 'x', item => escalaX( item.estado ) )
    .attr( 'y', item => escalaY( item.tipo_variante ) )
    .attr('width', escalaX.bandwidth())
    .attr('height', escalaY.bandwidth())
    // .attr('rx', 4)
    .attr('fill', item => escalaColor(item.cantidad))

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
    .data(datos)
    .enter()
    .append('text')
    .attr('class', 'valor')
    // centradas
    .attr('x',
      item =>
        escalaX(item.estado) +
        escalaX.bandwidth() / 2
    )
    .attr( 'y',
      item =>
        escalaY(item.tipo_variante) +
        escalaY.bandwidth() / 2
    )
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    // El color del texto cambia según el valor
    .attr( 'fill',
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
    .attr('x', props.margen.left)
    .attr('y', 28)
    .attr('fill', 'white')
    .style('font-size', '18px')
    .style('font-weight', '600')
    .text(props.titulo)
}

watch(
  () => props.data,
  () => {
    nextTick(() => {
      dibujarHeatmap()
    })
  },
  {
    // permite detectar cambios dentro de los objetos del arreglo.
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
    resizeObserver.observe(contenedorRef.value)
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
    class="heatmap-container"
  >
    <!-- D3 necesita que el SVG exista en el navegador -->
    <!-- eslint-disable-next-line -->
    <svg ref="svgRef"></svg>
  </div>
</template>


<style lang="scss" scoped>
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
