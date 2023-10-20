<script setup>
import * as d3 from 'd3'
import { onMounted, ref, toRefs, watch } from 'vue'

const props = defineProps({
  lineas_complejas_id: {
    type: String,
    default: () => 'lineas',
  },
  datos: {
    type: Array,
    // type: Object,
  },
  variables: {
    type: Array,
    default: function () {
      return [{ cve: 'VSIN', nombre: 'VSIN', color: '#2c7fb8' }]
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
  nombre_columna_horizontal: String,
  conversionTemporal: {
    type: Function,
    default: () => d3.timeParse('%Y-%m-%d'),
  },
  alto_vis: {
    type: Number,
    default: 400,
  },
  titulo_tooltip: {
    type: String,
    default: '',
  },
  ancho_tooltip: {
    type: Number,
    default: 140,
  },
  tipo_tooltip: {
    type: String,
    default: () => 'individual',
  },
  margen: {
    type: Object,
    default: () => ({
      arriba: 10,
      abajo: 30,
      izquierda: 60,
      derecha: 20,
    }),
  },
  titulo: String,
  instruccional: String,
  fecha_actualizacion: String,
  titulo_leyenda: String,
  texto_fuente: String,
  texto_notas: String,
  link_descarga_csv: String,
  nombre_variables: {
    type: Object,
    default: function () {
      return { nombre: 'nombre' }
    },
  },
  columnas_descargables: {
    type: Array,
    default: () => ['nombre', 'cantidad_1', 'cantidad_2'],
  },
  ancho_vis: {
    type: Number,
    default: 500,
  },
  notas: {
    type: String,
  },
})

const { datos, variables, margen } = toRefs(props)

const ancho_leyenda_y = ref(0)
// const tooltip_data_seleccionada = ref({})

const claves = ref([])

const svg = ref({})
const grupo_contenedor = ref({})
const grupo_frente = ref({})

const ancho = ref(100)
const alto = ref(100)

const escalaX = ref({})
const escalaY = ref({})

const guia_x = ref({})
const guia_y = ref({})

const tooltip = ref({})

const grupos_lineas = ref({})
const grupos_puntos = ref({})

const eje_x = ref({})
const eje_y = ref({})

// function esUnEstado() {
//   return datos.value.length === 1
// }

// function multiFormat(date) {
//   /**
//    * Translate date
//    */
//   const locale = d3.timeFormatLocale({
//     decimal: ',',
//     thousands: '.',
//     grouping: [3],
//     currency: ['€', ''],
//     dateTime: '%A, %e %B %Y г. %X',
//     date: '%d.%m.%Y',
//     time: '%H:%M:%S',
//     periods: ['AM', 'PM'],
//     days: [
//       'Domingo',
//       'Lunes',
//       'Martes',
//       'Miércoles',
//       'Jueves',
//       'Viernes',
//       'Sábado',
//     ],
//     shortDays: ['Dom', 'Lun', 'Mar', 'Mi', 'Jue', 'Vie', 'Sab'],
//     months: [
//       'Enero',
//       'Febrero',
//       'Marzo',
//       'Abril',
//       'Mayo',
//       'Junio',
//       'Julio',
//       'Agosto',
//       'Septiembre',
//       'Octubre',
//       'Noviembre',
//       'Diciembre',
//     ],
//     shortMonths: [
//       'Ene',
//       'Feb',
//       'Mar',
//       'Abr',
//       'May',
//       'Jun',
//       'Jul',
//       'Ago',
//       'Sep',
//       'Oct',
//       'Nov',
//       'Dic',
//     ],
//   })
//   const formatMillisecond = locale.format('.%L'),
//     formatSecond = locale.format(':%S'),
//     formatMinute = locale.format('%I:%M'),
//     formatHour = locale.format('%I %p'),
//     formatDay = locale.format('%a %d'),
//     formatWeek = locale.format('%b %d'),
//     formatMonth = locale.format('%b'),
//     formatYear = locale.format('%Y')
//   return (
//     d3.timeSecond(date) < date
//       ? formatMillisecond
//       : d3.timeMinute(date) < date
//       ? formatSecond
//       : d3.timeHour(date) < date
//       ? formatMinute
//       : d3.timeDay(date) < date
//       ? formatHour
//       : d3.timeMonth(date) < date
//       ? d3.timeWeek(date) < date
//         ? formatDay
//         : formatWeek
//       : d3.timeYear(date) < date
//       ? formatMonth
//       : formatYear
//   )(date)
// }

// function Objeto(fecha_recoleccion, tipo_variante) {
//   /**
//    * Construcción de objetoDatos
//    */
//   // Constructor
//   return {
//     fecha_recoleccion: fecha_recoleccion,
//     tipo_variante: tipo_variante,
//   }
// }
// function Objeto2(
//   fecha_recoleccion,
//   tipo_variante_0,
//   tipo_variante_1,
//   tipo_variante_2,
//   tipo_variante_3,
//   tipo_variante_4
// ) {
//   // Constructor
//   return {
//     fecha_recoleccion: fecha_recoleccion,
//     VSIN: tipo_variante_0,
//     VIN: tipo_variante_1,
//     VOM: tipo_variante_2,
//     VOC: tipo_variante_3,
//     VOI: tipo_variante_4,
//   }
// }
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
function cerrarTooltip() {
  tooltip.value.style('visibility', 'hidden')
}
function configurandoDimensionesParaSVG() {
  ancho_leyenda_y.value = document.querySelector(
    '#' +
      props.lineas_complejas_id +
      ' .rotation-wrapper-outer .element-to-rotate'
  ).clientHeight
  ancho.value =
    document.querySelector(`#${props.lineas_complejas_id}`).clientWidth -
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
  grupo_frente.value.attr(
    'transform',
    `translate(${margen.value.izquierda},${margen.value.arriba})`
  )
}
function configurandoDimensionesParaLinea() {
  const parseTime = d3.timeParse('%Y-%m-%d')
  datos.value.forEach(d => {
    d.fech = parseTime(d['fecha_recoleccion'])
  })
  escalaX.value = d3
    .scaleTime()
    .domain(d3.extent(datos.value.map(d => d.fech)))
    .range([0, ancho.value])

  claves.value = variables.value.map(d => d.cve)
  if (claves.value.length !== 0) {
    escalaY.value = d3
      .scaleLinear()
      .domain([
        d3.min(datos.value.map(d => d3.min(claves.value.map(dd => d[dd])))),
        d3.max(datos.value.map(d => d3.max(claves.value.map(dd => d[dd])))),
      ])
      .range([alto.value, 0])
  } else {
    escalaY.value = d3.scaleLinear().domain([0, 0]).range([alto.value, 0])
  }
  console.log(datos.value)
}
function creandoLineas() {
  grupo_contenedor.value.selectAll('g.grupos-lineas-puntos').remove()
  const grupos_series = grupo_contenedor.value
    .selectAll('grupos-lineas-puntos')
    .data(variables.value)
    .enter()
    .append('g')
    .attr('class', 'grupos-lineas-puntos')

  grupos_lineas.value = grupos_series
    .style('fill', 'none')
    .style('stroke', d => d.color)
    .style('stroke-width', '1px')
    .selectAll('lineas')
    .data(d => {
      return [
        datos.value.map(dd => ({
          fech: dd.fech,
          cat: dd[d.cve],
          color: d.color,
          cve: d.cve,
          resaltado: d.resaltado,
        })),
      ]
    })
    .enter()
    .append('path')
    .attr('class', 'lineas')

  if (variables.value.length === 1) {
    grupos_puntos.value = grupos_series
      .selectAll('puntos')
      .data(d => {
        return [
          datos.value.map(dd => ({
            fech: dd.fech,
            cat: dd[d.cve],
            color: d.color,
            cve: d.cve,
            resaltado: d.resaltado,
          })),
        ]
      })
      .enter()
      .selectAll('puntos')
      .data(d => d)
      .enter()
      .append('circle')
      .attr('class', 'puntos')
  }
  // if (props.tooltip_activo) {
  //   svg.value
  //     .on('mousemove', evento => {
  //       if (props.tipo_tooltip === 'individual')
  //         mostrarTooltipIndividual(evento)
  //       else if (props.tipo_tooltip === 'general') mostrarTooltipGeneral(evento)
  //     })
  //     .on('mouseout', cerrarTooltip)
  // }
}
function actualizandoLineas() {
  grupos_lineas.value
    .attr('d', dd => {
      return d3
        .line()
        .x(d => escalaX.value(d.fech))
        .y(d => escalaY.value(d.cat))(dd)
    })

    .attr('d', dd => {
      return d3
        .line()
        .x(d => escalaX.value(d.fech))
        .y(d => escalaY.value(d.cat))(dd)
    })
  if (variables.value.length === 1) {
    grupos_puntos.value
      .style('fill', d => d.color)
      .style('stroke', '#fff')
      .attr('r', 5)
      .attr('cx', d => escalaX.value(d.fech))
      .attr('cy', d => escalaY.value(d.cat))
  }

  eje_x.value
    .attr(
      'transform',
      `translate(${margen.value.izquierda}, ${
        alto.value + margen.value.arriba
      })`
    )
    .call(d3.axisBottom(escalaX.value).ticks(5).tickFormat(multiFormat))
  eje_x.value
    .selectAll('text')
    //.style("text-anchor","middle")
    .style('dominant-baseline', 'middle')
  eje_x.value.selectAll('line').remove()
  eje_x.value.select('path').remove()
  // this.eje_x.select("path").attr("d", () => {
  //   return this.eje_x.select("path").attr("d").replace("M0,6", "M0,0").replace("V6", "V0")
  // })
  eje_y.value
    .attr(
      'transform',
      `translate(${margen.value.izquierda}, ${margen.value.arriba})`
    )
    .call(d3.axisLeft(escalaY.value).ticks(5))
  eje_y.value.select('path').style('opacity', 0)
  eje_y.value
    .selectAll('line')
    .attr('x2', ancho.value)
    .style('stroke-dasharray', '3 2 ')
    .style('stroke', 'gray')
}

onMounted(() => {
  svg.value = d3.select('div#' + props.lineas_complejas_id + ' svg.svg-lineas')
  grupo_contenedor.value = svg.value.select('g.grupo-contenedor-de-lineas')

  guia_x.value = grupo_contenedor.value.select('line.guia-x')
  guia_y.value = grupo_contenedor.value.select('line.guia-y')

  tooltip.value = d3
    .select('div#' + props.lineas_complejas_id)
    .select('div.tooltip')
  eje_x.value = svg.value.select('g.eje-x')
  eje_y.value = svg.value.select('g.eje-y')

  grupo_frente.value = svg.value.select('g.grupo-frente')

  configurandoDimensionesParaSVG()
  configurandoDimensionesParaLinea()
  creandoLineas()
  actualizandoLineas()
  // /**
  //  * Formateando datos
  //  */
  // // Obteniendo keys o nombre de la variable columna obj
  // const asArray = Object.entries(datos.value)
  // // console.log('asArray', asArray)
  // // Convirtiendo los sub objetos de valores en arreglo
  // const dateArray = Object.values(asArray[0][1])
  // const estadoArray = Object.values(asArray[1][1])
  // const varianteArray = Object.values(asArray[2][1])
  // const OMSArray = Object.values(asArray[3][1])
  // // Creando arrelgo de Objetos
  // const dataBase = []
  // for (let i = 0; i < dateArray.length; i++) {
  //   const nuevoObjeto = Objeto(
  //     estadoArray[i],
  //     dateArray[i],
  //     varianteArray[i],
  //     OMSArray[i]
  //   )
  //   dataBase.push(nuevoObjeto)
  // }
  // // console.log("dataBase",dataBase);
  // /**
  //  * Filtrando baseDatos por fecha_recolección
  //  * this.fecha_actualización '2021-04-30' -6 en mes
  //  */
  // const dateFiltered = dataBase.filter(d => d.fecha_recoleccion > '2020-12-31')
  // // console.log("dateFiltered",dateFiltered)
  // /**
  //  * Función para Parse el tiempo
  //  */
  // const parseTime = d3.timeParse('%Y-%m-%d')
  // const date = []
  // dateFiltered.forEach(d => {
  //   // Push ParseDateFiltered to dateArray
  //   date.push(parseTime(d.fecha_recoleccion))
  // })
  // // TODO: Filtrar por estado
  // /**
  //  * CASO 1 - Selección por tipo de variante: VOC
  //  * Caso resuelto para filtrar cada key object de tipo de variante.
  //  *  */
  // // const vocDatosFiltered = dateFiltered.filter(d => d.tipo_variante == 'VOC');
  // // const voidateFiltered = dateFiltered.filter(d => d.tipo_variante == 'VOI');
  // // const vinDatosFiltered = dateFiltered.filter(d => d.tipo_variante == 'VIN');
  // // const vomDatosFiltered = dateFiltered.filter(d => d.tipo_variante == 'VOM');
  // // const vsinDatosFiltered = dateFiltered.filter(d => d.tipo_variante == 'VSIN');
  // // console.log("VOC", vocDatosFiltered);
  // // console.log("VOI", voidateFiltered);
  // // console.log("VIN", vinDatosFiltered);
  // // console.log("VIM", vomDatosFiltered);
  // // console.log("VSIN", vsinDatosFiltered);
  // // let grupos2 = {};
  // // voiDatosFiltered.forEach( d => {
  // //   const nombreGrupo = d.fecha_recoleccion;
  // //   if (!grupos2[nombreGrupo]) grupos2[nombreGrupo] = [];
  // //   grupos2[nombreGrupo].push(d);
  // // })
  // // Agrupando objetos clave del arreglo por propiedad: tipo_variante
  // const groupObj = {}
  // dateFiltered.forEach(alumno => {
  //   const nombreGrupo = alumno.tipo_variante
  //   if (!groupObj[nombreGrupo]) groupObj[nombreGrupo] = []
  //   groupObj[nombreGrupo].push(alumno)
  // })
  // // console.log("Object.keys(groupObj)",Object.keys(groupObj))
  // // Agrupando conjuntos
  // const keysGroupArray = []
  // for (let i = 0; i < Object.keys(groupObj).length; i++) {
  //   // Filtrando por tipo_variante
  //   const keyFiltered = dateFiltered.filter(
  //     d => d.tipo_variante === Object.keys(groupObj)[i]
  //   )
  //   const keyGroup = {}
  //   // Agrupando objetos del arreglo por propiedad: fecha_recoleccion
  //   keyFiltered.forEach(d => {
  //     const nombreGrupo = d.fecha_recoleccion
  //     if (!keyGroup[nombreGrupo]) keyGroup[nombreGrupo] = []
  //     keyGroup[nombreGrupo].push(d)
  //   })
  //   // console.log("keyGroup",keyGroup)
  //   // Re-agrupando objetos clave del arreglo por propiedad: tipo_variante
  //   const keyGroup2 = {}
  //   Object.entries(keyGroup).forEach(d => {
  //     const nombreGrupo = d[1][0].tipo_variante
  //     if (!keyGroup2[nombreGrupo]) keyGroup2[nombreGrupo] = []
  //     keyGroup2[nombreGrupo].push(d)
  //   })
  //   // console.log("keyGroup2",keyGroup2)
  //   keysGroupArray.push(keyGroup2)
  // }
  // /**
  //  * SVG d3.js
  //  */
  // // set the dimensions and margins of the graph
  // const margin = { top: 5, right: 20, bottom: 20, left: 40 },
  //   width =
  //     document.getElementById(props.lineas_complejas_id).clientWidth -
  //     margin.left -
  //     margin.right,
  //   height = 250 - margin.top - margin.bottom
  // // append the svg object to the body of the page
  // const svg = d3
  //   .select(`div#${props.lineas_complejas_id} svg.svg-lineas-complejas`)
  //   .attr('width', width + margin.left + margin.right)
  //   .attr('height', height + margin.top + margin.bottom)
  //   // .style("background-color", "#efefef") // Fondo comentar
  //   .append('g')
  //   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  // // Add Y axis
  // const y = d3.scaleLinear().range([height, 0])
  // // y.domain([0, 4000]); // Cambiar máximo
  // y.domain([0, 160]) // Cambiar máximo menos 10
  // svg
  //   .append('g')
  //   .call(d3.axisLeft(y).ticks(5).tickSize(0))
  //   .style('color', '#efefef')
  // // Draw Y lines
  // svg
  //   .append('g')
  //   .attr('class', 'grid')
  //   .call(d3.axisLeft(y).tickSize(-width, 0, 0).tickFormat('').ticks(4))
  //   .style('opacity', '0.3')
  //   .style('color', '#efefef')
  // // Add X axis -> it is a date format
  // const x = d3.scaleTime().range([0, width])
  // x.domain(
  //   d3.extent(date, function (d) {
  //     return d
  //   })
  // )
  // svg
  //   .append('g')
  //   .attr('transform', 'translate(0,' + height + ')')
  //   // .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")))
  //   // .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b")).tickSize(0))
  //   // .call(d3.axisBottom(x))
  //   .call(d3.axisBottom(x).tickFormat(multiFormat).tickSize(0))
  //   .selectAll('text')
  //   .style('text-anchor', 'start')
  //   .style('text-transform', 'uppercase')
  //   // .attr("transform",
  //   //         function() { return "rotate(0)"; })
  //   .attr('transform', 'translate(0,' + 5 + ')')
  //   .style('color', '#efefef')
  // // Draw X lines
  // svg
  //   .append('g')
  //   .attr('class', 'grid')
  //   .attr('transform', 'translate(0,' + height + ')')
  //   .call(
  //     d3
  //       .axisBottom(x)
  //       // .tickSize(-height)
  //       .tickSize(-height, 0, 0)
  //       .tickFormat('')
  //       .ticks(6)
  //   )
  //   .style('opacity', '0.3')
  //   .style('color', '#efefef')
  // /**
  //  * Dibujando líneas
  //  */
  // // Add the line 0 VSIN
  // svg
  //   .append('path')
  //   // .datum(data)
  //   .datum(keysGroupArray[0].VSIN)
  //   .attr('fill', 'none')
  //   // .attr("stroke", "steelblue")
  //   .attr('stroke', props.variables[0].color)
  //   .attr('stroke-width', 1.5)
  //   .attr(
  //     'd',
  //     d3
  //       .line()
  //       // .x(function(d) { return x(d.date) })
  //       // .y(function(d) { return y(d.value )})
  //       .x(function (d) {
  //         // console.log(parseTime(d[0]))
  //         return x(parseTime(d[0]))
  //       })
  //       .y(function (d) {
  //         // console.log(d[1].length)
  //         return y(d[1].length)
  //       })
  //   )
  // // Add the line 1 VIN
  // svg
  //   .append('path')
  //   .datum(keysGroupArray[1].VIN)
  //   .attr('fill', 'none')
  //   .attr('stroke', props.variables[1].color)
  //   .attr('stroke-width', 1.5)
  //   .attr(
  //     'd',
  //     d3
  //       .line()
  //       .x(function (d) {
  //         return x(parseTime(d[0]))
  //       })
  //       .y(function (d) {
  //         return y(d[1].length)
  //       })
  //   )
  // // Add the line 2 VOM
  // svg
  //   .append('path')
  //   .datum(keysGroupArray[2].VOM)
  //   .attr('fill', 'none')
  //   .attr('stroke', props.variables[2].color)
  //   .attr('stroke-width', 1.5)
  //   .attr(
  //     'd',
  //     d3
  //       .line()
  //       .x(function (d) {
  //         return x(parseTime(d[0]))
  //       })
  //       .y(function (d) {
  //         return y(d[1].length)
  //       })
  //   )
  // // Add the line 3 VOC
  // svg
  //   .append('path')
  //   .datum(keysGroupArray[3].VOC)
  //   .attr('fill', 'none')
  //   .attr('stroke', props.variables[3].color)
  //   .attr('stroke-width', 1.5)
  //   .attr(
  //     'd',
  //     d3
  //       .line()
  //       .x(function (d) {
  //         return x(parseTime(d[0]))
  //       })
  //       .y(function (d) {
  //         return y(d[1].length)
  //       })
  //   )
  // // Add the line 4 VOI
  // svg
  //   .append('path')
  //   .datum(keysGroupArray[4].VOI)
  //   .attr('fill', 'none')
  //   .attr('stroke', props.variables[4].color)
  //   .attr('stroke-width', 1.5)
  //   .attr(
  //     'd',
  //     d3
  //       .line()
  //       .x(function (d) {
  //         return x(parseTime(d[0]))
  //       })
  //       .y(function (d) {
  //         return y(d[1].length)
  //       })
  //   )
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
watch(margen, () => {
  // reescalandoPantalla()
})
</script>

<template>
  <div
    :id="lineas_complejas_id"
    class="contenedor-lineas"
  >
    <slot name="encabezado"></slot>

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
      <svg class="svg-lineas">
        <defs>
          <clipPath id="clip">
            <rect></rect>
          </clipPath>
        </defs>
        <g class="eje-x"></g>
        <g class="eje-y"></g>
        <g class="grupo-fondo"></g>
        <g class="grupo-contenedor-de-lineas">
          <line class="guia-x"></line>
          <line class="guia-y"></line>
        </g>
        <g class="grupo-frente"></g>
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
  <!-- <div
    class="contenedor-lineas-complejas"
    v-bind:id="lineas_complejas_id"
    :class="{ 'es-un-estado': esUnEstado }"
  >
    <div class="lineas-header">
      <h1
        class=""
        v-if="titulo"
      >
        {{ titulo }}
      </h1>
      <p
        class="fecha-actualizacion"
        v-if="fecha_actualizacion"
      >
        Última actualización: {{ fecha_actualizacion }}
      </p>
    </div>
    <div class="lineas-body">
      <div class="contenedor-svg">
        <svg class="svg-lineas-complejas">
          <defs></defs>
          <g class="grupo-contenedor-de-lineas"></g>
        </svg>
      </div>
    </div>
    <div class="lineas-footer">
      <div id="leyenda-lineas-complejas">
        <p class="titulo-leyenda">{{ titulo_leyenda }}</p>
      </div>
    </div>
  </div> -->
</template>

<style lang="scss" scoped>
svg.svg-lineas {
  position: absolute;
  top: 0;
}

svg.svg-lineas::v-deep text {
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
// @import '@/scss/app.scss';
// $border-radius-tarjeta: 10px;
// .titulo-visualizacion {
//   font-size: 16px;
//   // font-size: map-get($fuente, "size-primario");
//   padding: 10px;
//   margin: 0;
// }
// p.fecha-actualizacion {
//   font-size: 12px;
//   // font-size: map-get($fuente, "size-notas");
//   padding: 0 10px;
//   margin: 5px 0;
// }
// div.contenedor-lineas-complejas {
//   // font-family: "Montserrat";
//   width: 100%;
//   // border: solid black 1px;
//   // border-radius: $border-radius-tarjeta;
//   @media (min-width: 769px) {
//     &.es-un-estado {
//       // display: grid;
//       grid-template-areas:
//         'header body'
//         'footer body';
//       grid-template-columns: 300px 1fr;
//       grid-template-rows: auto 1fr;
//       .lineas-header {
//         grid-area: header;
//         // border-right: 1px solid black;
//       }
//       .lineas-body {
//         grid-area: body;
//       }
//       .lineas-footer {
//         grid-area: footer;
//         // border-right: 1px solid black;
//         // border-top: 1px solid black;
//         div#leyenda-lineas-complejas {
//           box-shadow: none;
//           > div {
//             width: 50%;
//             flex: 0 0 50%;
//           }
//         }
//       }
//     }
//   }
// }
// div#leyenda-lineas-complejas {
//   display: -webkit-box;
//   display: -ms-flexbox;
//   display: flex;
//   -ms-flex-wrap: wrap;
//   flex-wrap: wrap;
//   border-radius: $border-radius-tarjeta;
//   // box-shadow: 0px -5px 5px -1px rgb(221, 221, 221);
//   margin-bottom: 10px;
//   justify-content: center;
//   p.titulo-leyenda {
//     width: 100%;
//     margin-bottom: 5px;
//     text-align: center;
//     font-size: 12px;
//     // font-size: map-get($fuente, "size-notas");
//     font-weight: 700;
//   }
//   div {
//     margin-top: 10px;
//     width: 16%;
//     -ms-flex: 0 0 16%;
//     flex: 0 0 16%;
//     max-width: calc(50% - 20px);
//     padding: 0px 10px;
//     display: flex;
//     span.categoria-color {
//       width: 25px;
//       height: 25px;
//       min-width: 25px;
//       display: inline-block;
//       border-radius: 50%;
//       position: relative;
//     }
//     span.categoria-texto {
//       display: inline-block;
//       position: relative;
//       padding-left: 5px;
//       font-size: 10px;
//       top: 50%;
//       transform: translateY(-50%);
//       margin-bottom: auto;
//     }
//     &.active {
//       color: #000;
//     }
//     &.inactive {
//       color: gray;
//       span.categoria-color {
//         background: #dbdbdb !important;
//       }
//     }
//   }
// }
</style>
