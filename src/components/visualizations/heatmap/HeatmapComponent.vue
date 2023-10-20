<script setup>
import * as d3 from 'd3'

import CheckboxColor from '@/components/utils/CheckboxColor.vue'

import { computed, onMounted, onUnmounted, ref, toRefs, watch } from 'vue'

import variantesjson from '@/assets/data/variantes.json'
const variantes = variantesjson

import consorcioHeatmap from '@/assets/datasets/consorcio_heatmap.json'
// import consorcioVariantesHeatmapTodas from '@/assets/datasets/consorcio_variantes_heatmap_todas.json'

// import { useStore } from '@/stores'
import store from '../../../store'
// const store = useStore()

const public_path = process.env.BASE_URL

// const varianteSeleccionada = computed({
//   // getter
//   get() {
//     return store.variante_seleccionada
//   }
// })
const varianteSeleccionada = computed(() => {
  // return store.variante_seleccionada
  return store.state.variante_seleccionada
})

const dictValuesRango = {
  Rango_0: '0',
  Rango_1: '0 a 19',
  Rango_2: '20 a 39',
  Rango_3: '40 a 59',
  Rango_4: '60 a 79',
  Rango_5: '80 o más'
}

const dictColorsRango = {
  Rango_0: '#f0f0f0',
  Rango_1: '#d9d9d9',
  Rango_2: '#bdbdbd',
  Rango_3: '#969696',
  Rango_4: '#737373',
  Rango_5: '#525252'
}

const vvariables = Object.entries(dictValuesRango).map((rango) => {
  return {
    color: dictColorsRango[rango[0]],
    nombre: rango[1],
    id: rango[0]
  }
})

const props = defineProps({
  mapa_calor_id: {
    type: String,
    default: () => 'mapa_calor'
  },
  datos: {
    type: Array,
    // type: Object,
    default: () => [{ grupo: 'A', variable: 'v1', cantidad: '30' }]
  },
  titulo: String,
  instruccional: String,
  fecha_actualizacion: String,
  titulo_leyenda: String,
  titulo_tooltip: {
    type: String,
    default: ''
  },
  alto_vis: {
    type: Number,
    default: 500
  },
  ancho_vis: {
    type: Number,
    default: 500
  },
  margin: {
    type: Object,
    default: () => ({
      top: 10,
      right: 0,
      bottom: 40,
      left: 40
    })
  },
  variables: {
    type: Array,
    default: function () {
      return ['grupo', 'variable', 'cantidad']
    }
  }
})

const { datos } = toRefs(props)

const status_button = ref('Quitar todos')
const lista_filtros_activos = ref([])
const variables_grafica = vvariables

const width = ref(100)
const height = ref(100)
const width_limit = 769
const datas = ref([])

const keyAbreviatura = ref([])
const keyVariante = ref([])
const completo = ref([])
const parentesis = ref([])

const eje_x_bottom = ref({})
const eje_y = ref({})
const eje_y_abr = ref({})
const eje_x_top = ref({})

const svg = ref({})
const grupo_contenedor = ref({})

const categorias_checkeadas = ref([])

const x = ref({})
const y = ref({})

const heatmap = ref({})

const heatmapRef = ref('')
const tooltipRef = ref('')
const tooltipVariableRef = ref('')
const tooltipCifraRef = ref('')

function quitaPon() {
  if (!lista_filtros_activos.value.includes(false)) {
    status_button.value = 'Poner todos'
    lista_filtros_activos.value = lista_filtros_activos.value.map(() => false)
  } else {
    status_button.value = 'Quitar todos'
    lista_filtros_activos.value = lista_filtros_activos.value.map(() => true)
  }
}

/**
 * Método para configurar las dimensiones del elemento SVG
 */
function configurandoDimensionesParaSVG() {
  // set the dimensions with margins to the graph
  width.value =
    document.getElementById('contenedor_vis').clientWidth - props.margin.left - props.margin.right

  if (window.innerWidth >= width_limit) {
    // 769
    height.value = 400 - props.margin.top - props.margin.bottom // Desktop
  } else {
    height.value = 600 - props.margin.top - props.margin.bottom // Mobile
  }

  svg.value
    .attr('width', width.value + props.margin.left + props.margin.right)
    .attr('height', height.value + props.margin.top + props.margin.bottom)
  // .style('background-color', '#eee') // <-- comentar

  grupo_contenedor.value.attr('transform', `translate(${props.margin.left}, ${props.margin.top})`)
}
/**
 * Método para calcular los valores del heatmap
 * dependiendo del tipo de variante o si son todas
 */
function calculoHeatmap(tipoVariante) {
  if (tipoVariante.value === 'VTODAS') {
    // Asignando database
    const datosJSON = datos.value
    // const datosJSON = consorcioVariantesHeatmapTodas
    // console.log('datosJSON', datosJSON)

    // Creando keysArray para estado, tipo_variante y abreviatura_ent
    const groupEstado = {}
    Object.values(datosJSON).forEach((alumno) => {
      const nombreGrupo = alumno.estado
      if (!groupEstado[nombreGrupo]) groupEstado[nombreGrupo] = []
      groupEstado[nombreGrupo].push(alumno)
    })
    const keyEstado = Object.keys(groupEstado)
    // console.log("keyEstado",keyEstado);
    const groupTipoVariante = {}
    Object.values(datosJSON).forEach((alumno) => {
      const nombreGrupo = alumno.tipo_variante
      if (!groupTipoVariante[nombreGrupo]) groupTipoVariante[nombreGrupo] = []
      groupTipoVariante[nombreGrupo].push(alumno)
    })
    const keyTipoVariante = Object.keys(groupTipoVariante)
    keyVariante.value = keyTipoVariante
    // console.log("keyTipoVariante",keyTipoVariante);
    const groupAbreviaturaEnt = {}
    Object.values(datosJSON).forEach((alumno) => {
      const nombreGrupo = alumno.abreviatura_ent
      if (!groupAbreviaturaEnt[nombreGrupo]) groupAbreviaturaEnt[nombreGrupo] = []
      groupAbreviaturaEnt[nombreGrupo].push(alumno)
    })
    keyAbreviatura.value = Object.keys(groupAbreviaturaEnt)
    // console.log("keyAbreviatura",keyAbreviatura);

    // const completo = ['Interés nacional', 'Preocupación', 'Monitoreo', 'Sin clasificación', 'Interés'];
    // const parentesis = ['(VIN)', '(VOC)', '(VOM)', '(VSIN)', '(VOI)'];
    completo.value = ['Variable 1', 'Variable 2', 'Variable 3', 'Variable 4', 'Variable 5']
    parentesis.value = ['', '', '', '', '']

    // Creando un nuevo arreglo de objectos con las claves ya filtradas y sumadas
    const arregloObjectos = []
    for (let i = 0; i < keyEstado.length; i++) {
      // Recorre por el número de estados y asigna el conjunto filtrado
      const filtroEstado = Object.values(datosJSON).filter((d) => d.estado === keyEstado[i])

      for (let j = 0; j < keyTipoVariante.length; j++) {
        // Recorre por el número de tipo de variantes asignando el conjunto filtrado
        // y recorre el conjunto para sumar la cantidad de muestras en total
        const filtroTipoVariante = filtroEstado.filter(
          (d) => d.tipo_variante === keyTipoVariante[j]
        )
        let valor = 0
        filtroTipoVariante.forEach((element) => {
          // valor += element.cantidad_muestras;
          // valor += parseFloat(element.cantidad_muestras);
          valor = parseFloat(element.cantidad_muestras)
        })
        // Empujalo al arreglo de objectos para la nueva base de datos
        arregloObjectos.push(
          Object.create({
            group: keyEstado[i],
            abreviatura: keyAbreviatura.value[i],
            variable: keyTipoVariante[j],
            variable_completa: completo.value[j],
            value: valor
          })
        )
      }
    }
    // Imprime datos que se muestran en el heatmap
    // console.log('arregloObjectos', arregloObjectos);
    // Asignalos a la data
    datas.value = arregloObjectos
  } else {
    // Asignando database
    const datosJSON = consorcioHeatmap
    // console.log('datosJSON', datosJSON)

    // Filtro Tipo de Variante
    const filtroTipoVariante = Object.values(datosJSON).filter(
      (d) => d.tipo_variante === tipoVariante.value
    )

    // Creando keyArray para estado, variante_oms y abreviatura_ent
    const groupEstado = {}
    Object.values(datosJSON).forEach((alumno) => {
      const nombreGrupo = alumno.estado
      if (!groupEstado[nombreGrupo]) groupEstado[nombreGrupo] = []
      groupEstado[nombreGrupo].push(alumno)
    })
    const keyEstado = Object.keys(groupEstado)
    // console.log("keyEstado",keyEstado);
    const groupVarianteOMS = {}
    Object.values(filtroTipoVariante).forEach((alumno) => {
      const nombreGrupo = alumno.variante_oms
      if (!groupVarianteOMS[nombreGrupo]) groupVarianteOMS[nombreGrupo] = []
      groupVarianteOMS[nombreGrupo].push(alumno)
    })
    let keyVarianteOMS = []
    if (tipoVariante.value === 'VSIN') {
      // Variantes sin clasificación // <-- PEDIR AL STORE EL TOP 5
      // this.keyVarianteOMS = ['B.1.551'];
      keyVarianteOMS = ['5.5', '5.4', '5.3', '5.2', '5.1']
    } else {
      keyVarianteOMS = Object.keys(groupVarianteOMS)
    }
    keyVariante.value = keyVarianteOMS
    // console.log("keyVarianteOMS",keyVarianteOMS);
    const groupAbreviaturaEnt = {}
    Object.values(datosJSON).forEach((alumno) => {
      const nombreGrupo = alumno.abreviatura_ent
      if (!groupAbreviaturaEnt[nombreGrupo]) groupAbreviaturaEnt[nombreGrupo] = []
      groupAbreviaturaEnt[nombreGrupo].push(alumno)
    })
    keyAbreviatura.value = Object.keys(groupAbreviaturaEnt)
    // console.log("keyAbreviatura",keyAbreviatura);

    // Creando un nuevo arreglo de objectos con las claves ya filtradas y sumadas
    const arregloObjectos = []
    for (let i = 0; i < keyEstado.length; i++) {
      // Recorre por el número de estados y asigna el conjunto filtrado
      const filtroEstado = filtroTipoVariante.filter((d) => d.estado === keyEstado[i])

      for (let j = 0; j < keyVariante.value.length; j++) {
        // Recorre por el número de variantes_oms asignando el conjunto filtrado
        // y recorre el conjunto para regresar la cantidad de muestras

        // Esto es lo que se tiene que implementar en el otro VTODAS
        const valor = filtroEstado
          .filter((d) => d.variante_oms === keyVariante.value[j])
          .map((d) => d.cantidad_muestras)
        const abr = filtroEstado.map((d) => d.abreviatura_ent)

        // Empujalo al arreglo de objectos para la nueva base de datos
        arregloObjectos.push(
          Object.create({
            group: keyEstado[i],
            abreviatura: abr[0],
            variante: tipoVariante,
            variable: keyVariante.value[j],
            // value: valor.length === 0 ? 0 : valor[0],
            value: valor
          })
        )
      }
    }
    // Imprime datos que se muestran en el heatmap
    // console.log('arregloObjectos', arregloObjectos);
    // Asignalos a la data
    datas.value = arregloObjectos
  }
}
/**
 * Método para configurar dimensiones para heatmap
 * en desktop y mobile
 */
function configurandoDimensionesParaHeatmap() {
  if (window.innerWidth >= width_limit) {
    // // 769
    // // Desktop
    // // Build X, Y scales:
    x.value = d3.scaleBand().range([50, width.value]).domain(keyAbreviatura.value).padding(0.03)
    y.value = d3.scaleBand().range([height.value, 0]).domain(keyVariante.value).padding(0.03)

    const y_1 = ref({})
    const y_1_p = ref({})

    if (varianteSeleccionada.value === 'VTODAS') {
      // Despliega el nombre de las variables completas
      y_1.value = d3.scaleBand().range([height.value, 0]).domain(completo.value).padding(0.03)
      // Despliega el nombre de las variables entre paréntesis
      y_1_p.value = d3.scaleBand().range([height.value, 0]).domain(parentesis.value).padding(0.03)
    }
    // Build X, Y axis:
    eje_x_bottom.value
      .attr('transform', `translate(33, ${height.value + 20} )`)
      .call(d3.axisBottom(x.value).tickSize(0))
      // .style('font-family', 'Montserrat')
      .selectAll('text')
      .style('text-anchor', 'end')
      .style('font-size', '10px')
      .attr('transform', 'rotate(-90)')
    eje_x_bottom.value.select('.domain').remove()

    if (varianteSeleccionada.value === 'VTODAS') {
      eje_y.value
        .call(d3.axisLeft(y_1.value).tickSize(0))
        // .style('font-family', 'Montserrat')
        .attr('transform', 'translate(5, 5)')
        .selectAll('text')
        .style('text-anchor', 'start')
        .style('font-size', '10px')
      eje_y.value.select('.domain').remove()
      eje_y_abr.value.style('opacity', '1')
      eje_y_abr.value
        .call(d3.axisLeft(y_1_p.value).tickSize(0))
        // .style('font-family', 'Montserrat')
        .attr('transform', 'translate(5, 20)')
        .selectAll('text')
        .style('text-anchor', 'start')
        .style('font-size', '10px')
      eje_y_abr.value.select('.domain').remove()
    } else {
      eje_y.value
        .call(d3.axisLeft(y.value).tickSize(0))
        // .style('font-family', 'Montserrat')
        .attr('transform', 'translate(5, 5)')
        .selectAll('text')
        .style('text-anchor', 'start')
        .style('font-size', '10px')
      eje_y.value.select('.domain').remove()
      eje_y_abr.value.style('opacity', '0')
    }
  } else {
    // Mobile
    // Build X, Y scales:
    x.value = d3.scaleBand().range([0, width.value]).domain(keyVariante.value).padding(0.03)
    y.value = d3.scaleBand().range([0, height.value]).domain(keyAbreviatura.value).padding(0.05)
    // Build X, Y axis:
    eje_x_top.value
      .attr('transform', 'translate(40, 5)')
      .call(d3.axisBottom(x.value).tickSize(0))
      // .style('font-family', 'Montserrat')
      .selectAll('text')
      .style('text-anchor', 'middle')
      .style('font-size', '10px')
    eje_x_top.value.select('.domain').remove()
    eje_x_bottom.value
      .attr('transform', `translate(40, ${height.value + 30})`)
      .call(d3.axisBottom(x.value).tickSize(0))
      // .style('font-family', 'Montserrat')
      .selectAll('text')
      .style('text-anchor', 'middle')
      .style('font-size', '10px')
    eje_x_bottom.value.select('.domain').remove()
    eje_y.value
      .call(d3.axisLeft(y.value).tickSize(0))
      // .style('font-family', 'Montserrat')
      .style('text-anchor', 'start')
      .attr('transform', 'translate(10, 25)')
    eje_y.value.select('.domain').remove()
  }
}

function positionTooltip(e) {
  return {
    x:
      60 + parseInt(e.target.attributes['x'].value) + tooltipRef.value.clientWidth >
      heatmapRef.value.clientWidth
        ? e.pageX - tooltipRef.value.clientWidth - 5
        : e.pageX + 15,
    y:
      10 +
        parseInt(e.target.attributes['y'].value) +
        parseInt(e.target.attributes['height'].value) +
        tooltipRef.value.clientHeight >
      heatmapRef.value.clientHeight
        ? e.pageY - tooltipRef.value.clientHeight
        : e.pageY + 15
  }
}

function contenidoTooltip(datum) {
  return `${
    varianteSeleccionada.value === 'VTODAS' ? `${datum.variable_completa}` : datum.variable
  } | <b>${datum.value}</b>`
}
/**
 * Método para desplegar el tooltip
 */
function mostrarTooltip(evento, datum) {
  const position = positionTooltip(evento)
  // console.log(position)
  d3.select(tooltipRef.value)
    .style('visibility', 'visible')
    .style('left', `${position.x}px`)
    .style('top', `${position.y}px`)
  d3.select(tooltipVariableRef.value).text(datum.group)
  d3.select(tooltipCifraRef.value).html(contenidoTooltip(datum))
  // // d3.select(this.$refs.tooltip_cifra)
  // //   .html(`${datum.variable_completa} (${datum.variable}ho) | <b>${datum.value}</b>`);
  // // .html(`${this.variables
  // // .filter((d) => d.id === datum.data.key)[0].nombre} | <b>${datum.data[this.variables
  // // .filter((d) => d.id === datum.data.key)[0].id].toLocaleString('en')}<b>`)
  // // console.log('datum',datum.group);
  // // console.log('evento',evento);
}
/**
 * Método para esconder el tooltip
 */
function cerrarTooltip() {
  d3.select(tooltipRef.value).style('visibility', 'hidden').style('left', '0').style('top', '0')
}
/** */
function creandoHeatmapDesktop() {
  // Build color scale
  const escalaColor = variables_grafica.map((d) => d.color)
  const catChecked = categorias_checkeadas.value

  // remove all rects created
  grupo_contenedor.value.selectAll('rect.rects-heatmaps').remove()

  // Join rects with color values
  heatmap.value = grupo_contenedor.value
    .selectAll('grects')
    .data(datas.value, function (d) {
      return d.abreviatura + ':' + d.variable
    })
    .join('rect')
    .attr('class', (d) => `${d.abreviatura} rects-heatmaps`)
    .attr('width', x.value.bandwidth())
    .attr('height', y.value.bandwidth())
    .style('fill', function (d) {
      if (d.value === 0) {
        return catChecked.includes('Rango_0') ? escalaColor[0] : 'transparent'
      }
      if (d.value > 0 && d.value < 20) {
        return catChecked.includes('Rango_1') ? escalaColor[1] : 'transparent'
      }
      if (d.value >= 20 && d.value < 40) {
        return catChecked.includes('Rango_2') ? escalaColor[2] : 'transparent'
      }
      if (d.value >= 40 && d.value < 60) {
        return catChecked.includes('Rango_3') ? escalaColor[3] : 'transparent'
      }
      if (d.value >= 60 && d.value < 80) {
        return catChecked.includes('Rango_4') ? escalaColor[4] : 'transparent'
      }
      if (d.value >= 80) {
        return catChecked.includes('Rango_5') ? escalaColor[5] : 'transparent'
      }
    })
    .on('mousemove', (evento, datum) => {
      mostrarTooltip(evento, datum)
    })
    .on('mouseout', () => {
      cerrarTooltip()
    })
}
/**
 * Método para crear el heatmap versión movil
 */
function creandoHeatmapMobile() {
  // Build color scale
  const escalaColor = variables_grafica.map((d) => d.color)
  const catChecked = categorias_checkeadas.value

  // remove all rects created
  grupo_contenedor.value.selectAll('rect.rects-heatmaps').remove()

  // Join rects with color values
  heatmap.value = grupo_contenedor.value
    .selectAll('grects')
    .data(datas.value, function (d) {
      return d.abreviatura + ':' + d.variable
    })
    .join('rect')
    .attr('class', (d) => `${d.abreviatura} rects-heatmaps`)
    .attr('width', x.value.bandwidth())
    .attr('height', y.value.bandwidth())
    // .style("fill", function(d) { return myColor(d.value)} )
    .style('fill', function (d) {
      if (d.value === 0) {
        return catChecked.includes('Rango_0') ? escalaColor[0] : 'transparent'
      }
      if (d.value >= 0 && d.value < 20) {
        return catChecked.includes('Rango_1') ? escalaColor[1] : 'transparent'
      }
      if (d.value >= 20 && d.value < 40) {
        return catChecked.includes('Rango_2') ? escalaColor[2] : 'transparent'
      }
      if (d.value >= 40 && d.value < 60) {
        return catChecked.includes('Rango_3') ? escalaColor[3] : 'transparent'
      }
      if (d.value >= 60 && d.value < 80) {
        return catChecked.includes('Rango_4') ? escalaColor[4] : 'transparent'
      }
      return catChecked.includes('Rango_5') ? escalaColor[5] : 'transparent'
    })
    .attr('transform', 'translate(0, 15)')
    .on('click', (evento, datum) => {
      mostrarTooltip(evento, datum)
    })
}
/**
 * Método para actualizar vectores trazados del heatmap
 */
function actualizandoHeatmap() {
  heatmap.value
    .data(datas.value, function (d) {
      return d.abreviatura + ':' + d.variable
    })
    .attr('x', (d) =>
      window.innerWidth >= width_limit ? x.value(d.abreviatura) : x.value(d.variable)
    )
    .attr('y', (d) =>
      window.innerWidth >= width_limit ? y.value(d.variable) : y.value(d.abreviatura)
    )
}
function reescalandoPantalla() {
  configurandoDimensionesParaSVG()
  calculoHeatmap(varianteSeleccionada)
  // configurandoDimensionesParaHeatmap()
  // if (window.innerWidth >= width_limit) {
  //   creandoHeatmapDesktop()
  // } else {
  //   creandoHeatmapMobile()
  // }
  // actualizandoHeatmap()
}

onMounted(() => {
  // Asigna todas las variables de filtro de input en checked
  lista_filtros_activos.value = variables_grafica.map(() => true)

  // Dependiendo del valor de la lista de filtro
  //  asigna el id o colócalo vacío. Solo manda los que no están vacíos.
  categorias_checkeadas.value = vvariables
    .map((d, i) => (lista_filtros_activos.value[i] ? d.id : ''))
    .filter((d) => d !== '')

  // Asigna elementos a variables
  svg.value = d3.select(`div#${props.mapa_calor_id} svg.svg-heatmap`)
  grupo_contenedor.value = svg.value.select('g.grupo-contenedor-de-heatmap')
  const grupo_contenedor_ejes = svg.value.select('g.grupo-contenedor-de-ejes')

  // append and attribute class to axes
  eje_x_top.value = grupo_contenedor_ejes.append('g').attr('class', 'eje-x-top')
  eje_x_bottom.value = grupo_contenedor_ejes.append('g').attr('class', 'eje-x-bottom')
  eje_y.value = grupo_contenedor_ejes.append('g').attr('class', 'eje-y')
  eje_y_abr.value = grupo_contenedor_ejes.append('g').attr('class', 'eje-y-abr')

  configurandoDimensionesParaSVG()
  calculoHeatmap(varianteSeleccionada)
  configurandoDimensionesParaHeatmap()

  if (window.innerWidth >= width_limit) {
    creandoHeatmapDesktop()
  } else {
    creandoHeatmapMobile()
  }

  actualizandoHeatmap()

  window.addEventListener('resize', reescalandoPantalla)
})

onUnmounted(() => {
  window.removeEventListener('resize', reescalandoPantalla)
})

watch(datos, () => {
  configurandoDimensionesParaSVG()
  calculoHeatmap(varianteSeleccionada)
  configurandoDimensionesParaHeatmap()
  if (window.innerWidth >= width_limit) {
    creandoHeatmapDesktop()
  } else {
    creandoHeatmapMobile()
  }
  actualizandoHeatmap()
})

watch(varianteSeleccionada, () => {
  // Variante seleccionada proveniente del estado del store
  // console.log('varianteSeleccionada', newValue)

  configurandoDimensionesParaSVG()
  calculoHeatmap(varianteSeleccionada)
  configurandoDimensionesParaHeatmap()
  if (window.innerWidth >= width_limit) {
    creandoHeatmapDesktop()
  } else {
    creandoHeatmapMobile()
  }
  actualizandoHeatmap()
})

watch(
  lista_filtros_activos,
  () => {
    // Dependiendo del valor de la lista de filtro
    // asigna el id o colócalo vacío. Solo manda los que no están vacíos.
    categorias_checkeadas.value = variables_grafica
      .map((d, i) => (lista_filtros_activos.value[i] ? d.id : ''))
      .filter((d) => d !== '')

    configurandoDimensionesParaSVG()
    calculoHeatmap(varianteSeleccionada)
    configurandoDimensionesParaHeatmap()
    if (window.innerWidth >= width_limit) {
      creandoHeatmapDesktop()
    } else {
      creandoHeatmapMobile()
    }
    actualizandoHeatmap()
  },
  { deep: true }
)
</script>

<template>
  <div class="mapa-calor">
    <div class="encabezado">
      <h3 class="titulo-visualizacion">
        Número de casos relacionados con
        {{
          variantes.find((variante) => variante.clave === varianteSeleccionada).nombre.toLowerCase()
        }}
      </h3>
    </div>

    <div class="nomenclatura">
      <div class="leyenda-mapa-calor">
        <button @click="quitaPon" class="quita-pon">
          {{ status_button }}
        </button>
      </div>
      <div class="checks">
        <div class="label-1" v-for="(variable, i) in variables_grafica" :key="variable.id">
          <CheckboxColor :color="variable.color" v-model="lista_filtros_activos[i]"
            ><span class="categoria-texto"
              >{{ variable.nombre }} {{ lista_filtros_activos[i] }}</span
            >
          </CheckboxColor>
        </div>
      </div>
    </div>

    <div class="contenedor-vis" id="contenedor_vis">
      <div :id="mapa_calor_id">
        <svg class="svg-heatmap" ref="heatmapRef">
          <g class="grupo-contenedor-de-heatmap"></g>
          <g class="grupo-contenedor-de-ejes"></g>
        </svg>
      </div>

      <div class="tooltip-mapa-calor" ref="tooltipRef">
        <div class="contenedor-boton-cerrar">
          <span>{{ titulo_tooltip }}</span>
          <button class="boton-cerrar-tooltip" @click="cerrarTooltip()">
            <img :src="`${public_path}imgs/cerrar.svg`" alt="" class="img-cerrar" />
          </button>
        </div>
        <p class="tooltip-variable" ref="tooltipVariableRef"></p>
        <p class="tooltip-cifra" ref="tooltipCifraRef">120 | <b> 29.3%</b></p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$border-radius-tarjeta: 10px;

.mapa-calor {
  display: grid;
  grid-gap: 10px;
  max-height: 1200px;
  grid-template-areas:
    'titulo'
    'nomenclatura'
    'mapa';

  @media (min-width: 769px) {
    grid-template-areas:
      'titulo mapa'
      'nomenclatura mapa';
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 1fr 2fr;
    max-height: 450px;
  }

  .encabezado {
    grid-area: titulo;

    @media (min-width: 769px) {
      // background-color: goldenrod;
      border-bottom: 1px solid #ccc;
    }
    .titulo-visualizacion {
      font-size: 24px;
      font-weight: 900;
    }

    .instruccional {
      font-size: 12px;
    }
  }

  .nomenclatura {
    grid-area: nomenclatura;
    border-radius: $border-radius-tarjeta;
    // max-height: 200px;
    // box-shadow: 0px -5px 5px -1px rgb(221, 221, 221);

    .leyenda-mapa-calor {
      width: 100%;
      display: flex;

      .titulo-leyenda {
        // text-align: center;
        width: 55%;
        text-align: left;
        font-size: 12px;
        font-weight: 700;
        // flex: auto;
        margin-left: 10px;
      }

      .quita-pon {
        position: relative;
        right: 0px;
        margin: 5px 10px 5px auto;
        font-size: 12px;
        padding: 0 10px;
        color: #000;
        border: 1px solid #000000;
        border-radius: 5px;
        background: #fff;

        @media (max-width: 1025px) {
          //display: none;
        }
      }
    }

    .checks {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      margin-bottom: 10px;

      .label-1 {
        margin-top: 10px;
        width: 50%;
        // -ms-flex: 0 0 50%;
        // flex: 0 0 50%;
        -ms-flex: 0 0 33%;
        flex: 0 0 33%;
        max-width: calc(50% - 20px);
        padding: 0px 10px;
        display: flex;

        @media (min-width: 769px) {
          width: 20%;
          // -ms-flex: 0 0 16%;
          // flex: 0 0 16%;
          -ms-flex: 0 0 28%;
          flex: 0 0 28%;
        }

        .categoria-color {
          width: 25px;
          height: 25px;
          min-width: 25px;
          display: inline-block;
          border-radius: 50%;
          position: relative;
        }

        .categoria-texto {
          display: inline-block;
          position: relative;
          padding-left: 5px;
          font-size: 10px;
          top: 50%;
          transform: translateY(-50%);
          margin-bottom: auto;
        }
        &.active {
          color: #000;
        }
        &.inactive {
          color: gray;

          .categoria-color {
            background: #dbdbdb !important;
          }
        }
      }
    }

    .aviso {
      background: crimson;
      border-radius: 10px;
      color: white;
      padding: 30;
      margin-top: 30 * 1.5;
    }
  }

  .contenedor-vis {
    grid-area: mapa;
    // max-height: 200px;

    .tooltip-mapa-calor {
      position: absolute;
      visibility: hidden;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 8px;
      width: 180px;
      // padding: 0px 3px 0px 10px;
      padding: 10px;
      color: #fff;
      font-size: 12px;
      min-height: 40px;
      line-height: 1;

      .boton-cerrar-tooltip {
        background: none;
        border: none;
        padding: 0 0 0 5px;
        cursor: pointer;
        max-width: none;

        .img-cerrar {
          width: 30px;
          max-width: none;
          height: 30px;
        }
      }

      .contenedor-boton-cerrar {
        float: right;
        height: auto;
        width: 35px;
        // padding-top: 5px;
        justify-content: space-between;

        @media (min-width: 769px) {
          // En móvil el botón de cerrar desaparece
          display: none;
        }
      }
    }
  }
}
</style>
