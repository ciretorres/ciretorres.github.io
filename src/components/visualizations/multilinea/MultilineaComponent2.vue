<script setup>
import * as d3 from 'd3'
import { onMounted, ref, toRefs, watch } from 'vue'

const props = defineProps({
  linea_id: String,
  datos: Array,
  variables: Array,
  titulo_eje_y: String,
  titulo_eje_x: String,
  nombre_columna_horizontal: String,
  conversionTemporal: {
    type: Function,
    default: () => d3.timeParse('%d-%m-%Y'),
  },
  alto_vis: {
    type: Number,
    default: function () {
      return 300
    },
  },
  escala_logaritmica: {
    type: Boolean,
    default: false,
  },
  titulo_tooltip: {
    type: String,
    default: '',
  },
  ancho_tooltip: {
    type: Number,
    default: 180,
  },
  margen: {
    type: Object,
    default: () => ({ arriba: 10, abajo: 70, izquierda: 20, derecha: 30 }),
  },
  tipo_tooltip: {
    type: String,
    default: () => 'individual',
  },
  logo_conacyt: {
    type: Boolean,
    default: function () {
      return true
    },
  },
  tooltip_activo: {
    type: Boolean,
    default: function () {
      return true
    },
  },
  // textoTooltip: {
  //   type: Function,
  //   default() {
  //     return `<p>No sirve el tooltip</p>`
  //     // if (this.tipo_tooltip === 'general') {
  //     //   let total_muestras = d3.sum(
  //     //     this.variables.map(d => this.tooltip_data_seleccionada[d.cve])
  //     //   )
  //     //   let cifras_variables = this.variables.map(
  //     //     d => `<p>
  //     //   			<span class="nomenclatura-tooltip" style="background: ${d.color} "></span>
  //     //   			${d.cve} <b>${this.tooltip_data_seleccionada[d.cve].toLocaleString(
  //     //       'en'
  //     //     )}</b>
  //     //   			(${Math.round(
  //     //           (100 * this.tooltip_data_seleccionada[d.cve]) / total_muestras
  //     //         )}%)
  //     //   			</p>`
  //     //   )
  //     //   return `${cifras_variables.join('')}`
  //     // } else if (this.tipo_tooltip === 'individual') {
  //     //   let entidad = this.variables.filter(
  //     //     d => d.cve === this.tooltip_data_seleccionada.cve
  //     //   )[0]
  //     //   return `
  //     // 				<p>${entidad.nombre}</p>
  //     // 				${this.tooltip_data_seleccionada.fech
  //     //           .toLocaleDateString('en-GB')
  //     //           .replaceAll('/', '-')}<br/>
  //     // 				<b>${this.tooltip_data_seleccionada.cat.toLocaleString('en')}</b>  <br/>
  //     // 			`
  //     // }
  //   },
  // },
})

const { datos, variables, margen } = toRefs(props)

const ancho_leyenda_y = ref(0)
const tooltip_data_seleccionada = ref({})

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

function configurandoDimensionesParaSVG() {
  ancho_leyenda_y.value = document.querySelector(
    '#' + props.linea_id + ' .rotation-wrapper-outer .element-to-rotate'
  ).clientHeight
  ancho.value =
    document.querySelector(`#${props.linea_id}`).clientWidth -
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
  // console.log('datos.value', datos.value)
  datos.value.forEach(d => {
    d.fech = props.conversionTemporal(d[props.nombre_columna_horizontal])
  })
  escalaX.value = d3
    .scaleTime()
    .domain(d3.extent(datos.value.map(d => d.fech)))
    .range([0, ancho.value])

  claves.value = variables.value.map(d => d.cve)
  // console.log('claves.value', claves.value)
  // console.log(
  //   'datos.value.map(d => d3.min(claves.value.map(dd => d[dd])))',
  //   datos.value.map(d => d3.min(claves.value.map(dd => d[dd])))
  // )
  if (props.escala_logaritmica) {
    escalaY.value = d3
      .scaleLog()
      .domain([
        d3.min(datos.value.map(d => d3.min(claves.value.map(dd => d[dd])))),
        d3.max(datos.value.map(d => d3.max(claves.value.map(dd => d[dd])))),
      ])
      .range([alto.value, 0])
  } else {
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
  }
  // console.log(datos.value)
}
function mostrarTooltipIndividual(evento) {
  let bisecetDate = d3.bisector(d => d.fech).left
  let x0 = escalaX.value.invert(evento.layerX - margen.value.izquierda)
  let indice = bisecetDate(datos.value, x0)
  let d0 = datos.value[indice - 1]
  let d1 = datos.value[indice]
  if ((d0 !== undefined) & (d1 !== undefined)) {
    let datum = x0 - d0.fech > d1.fech - x0 ? d1 : d0
    let datos_y = claves.value
      .map(d => [d, datum[d]])
      .sort((a, b) => d3.ascending(a[1], b[1]))

    let bisectCantidad = d3.bisector(d => d).center
    let y0 = escalaY.value.invert(evento.layerY - margen.value.arriba)
    let indiceY = bisectCantidad(
      datos_y.map(d => d[1]),
      y0
    )

    tooltip_data_seleccionada.value = {
      fech: datum.fech,
      cve: datos_y[indiceY][0],
      cat: datum[datos_y[indiceY][0]],
      ...props.variables.filter(d => d.cve === datos_y[indiceY][0])[0],
    }
    guia_y.value
      .transition()
      .duration(50)
      .attr('x1', 0)
      .attr('y1', escalaY.value(tooltip_data_seleccionada.value.cat))
      .attr('x2', ancho.value)
      .attr('y2', escalaY.value(tooltip_data_seleccionada.value.cat))
      .style('stroke', 'gray')
    guia_x.value
      .transition()
      .duration(100)
      .attr('x1', escalaX.value(tooltip_data_seleccionada.value.fech))
      .attr('y1', 0)
      .attr('x2', escalaX.value(tooltip_data_seleccionada.value.fech))
      .attr('y2', alto.value)
      .style('stroke', 'gray')
    tooltip.value
      .style('visibility', 'visible')
      .style(
        'left',
        evento.layerX - margen.value.izquierda < 0.6 * ancho.value
          ? evento.layerX + 10 + ancho_leyenda_y.value + 'px'
          : +evento.layerX -
              props.ancho_tooltip -
              20 +
              ancho_leyenda_y.value +
              'px'
      )
      .style('top', evento.layerY + 'px')
      .attr('width', props.ancho_tooltip)
      .attr('height', 30)

    let contenido_tooltip = tooltip.value
      .select('div.tooltip-contenido')
      .style('background', tooltip_data_seleccionada.value.color)
      .style('min-width', props.ancho_tooltip + 'px')
      .style('border-radius', '8px')
      .style('width', props.ancho_tooltip + 'px')
      .style('padding', '0 3px 0 10px')

    let entidad = variables.value.filter(
      d => d.cve === tooltip_data_seleccionada.value.cve
    )[0]
    let textoTooltip = `
      				<p>${entidad.nombre}</p>
      				${tooltip_data_seleccionada.value.fech
                .toLocaleDateString('en-GB')
                .replaceAll('/', '-')}<br/>
      				<b>${tooltip_data_seleccionada.value.cat.toLocaleString('en')}</b>  <br/>`

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
function mostrarTooltipGeneral(evento) {
  let bisecetDate = d3.bisector(d => d.fech).left
  let x0 = escalaX.value.invert(evento.layerX - margen.value.izquierda)
  let indice = bisecetDate(datos.value, x0)
  let d0 = datos.value[indice - 1]
  let d1 = datos.value[indice]
  if ((d0 !== undefined) & (d1 !== undefined)) {
    tooltip_data_seleccionada.value = x0 - d0.fech > d1.fech - x0 ? d1 : d0

    guia_x.value
      .transition()
      .duration(100)
      .attr('x1', escalaX.value(tooltip_data_seleccionada.value.fech))
      .attr('y1', 0)
      .attr('x2', escalaX.value(tooltip_data_seleccionada.value.fech))
      .attr('y2', alto.value)
      .style('stroke', 'gray')

    tooltip.value
      .style('visibility', 'visible')
      .style(
        'left',
        evento.layerX - margen.value.izquierda < 0.5 * ancho.value
          ? evento.layerX + 20 + 1 * margen.value.izquierda + 'px'
          : +evento.layerX -
              props.ancho_tooltip -
              20 +
              ancho_leyenda_y.value +
              'px'
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
      .style('padding', '10px')

    let total_muestras = d3.sum(
      variables.value.map(d => tooltip_data_seleccionada.value[d.cve])
    )
    let cifras_variables = variables.value.map(
      d => `<p>
        			<span class="nomenclatura-tooltip" style="background: ${
                d.color
              } "></span>
        			${d.cve} <b>${tooltip_data_seleccionada.value[d.cve].toLocaleString(
        'en'
      )}</b>
        			(${Math.round(
                (100 * tooltip_data_seleccionada.value[d.cve]) / total_muestras
              )}%)
        			</p>`
    )
    let textoTooltip = `${cifras_variables.join('')}`

    // if (this.tipo_tooltip === 'general') {
    //   // let total_muestras = d3.sum(
    //   //   this.variables.map(d => this.tooltip_data_seleccionada[d.cve])
    //   // )
    //   // let cifras_variables = this.variables.map(
    //   //   d => `<p>
    //   //   			<span class="nomenclatura-tooltip" style="background: ${
    //   //           d.color
    //   //         } "></span>
    //   //   			${d.cve} <b>${this.tooltip_data_seleccionada[d.cve].toLocaleString(
    //   //     'en'
    //   //   )}</b>
    //   //   			(${Math.round(
    //   //           (100 * this.tooltip_data_seleccionada[d.cve]) / total_muestras
    //   //         )}%)
    //   //   			</p>`
    //   // )
    //   // return `${cifras_variables.join('')}`
    // } else if (this.tipo_tooltip === 'individual') {
    //   // let entidad = this.variables.filter(
    //   //   d => d.cve === this.tooltip_data_seleccionada.cve
    //   // )[0]
    //   // return `
    //   // 				<p>${entidad.nombre}</p>
    //   // 				${this.tooltip_data_seleccionada.fech
    //   //           .toLocaleDateString('en-GB')
    //   //           .replaceAll('/', '-')}<br/>
    //   // 				<b>${this.tooltip_data_seleccionada.cat.toLocaleString('en')}</b>  <br/>
    //   // 			`
    // }

    contenidoTooltip
      .select('div.tooltip-cifras')
      .html(textoTooltip)
      .style('margin', '0')
      .style('padding', '0')

    tooltip.value
      .style('height', contenidoTooltip.style('height') + 'px')
      .style('width', parseInt(contenidoTooltip.style('width'), 10) + 13 + 'px')
  }
}
function cerrarTooltip() {
  tooltip.value.style('visibility', 'hidden')
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
  if (props.tooltip_activo) {
    svg.value
      .on('mousemove', evento => {
        if (props.tipo_tooltip === 'individual')
          mostrarTooltipIndividual(evento)
        else if (props.tipo_tooltip === 'general') mostrarTooltipGeneral(evento)
      })
      .on('mouseout', cerrarTooltip)
  }
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
function reescalandoPantalla() {
  configurandoDimensionesParaSVG()
  configurandoDimensionesParaLinea()
  actualizandoLineas()
}

onMounted(() => {
  claves.value = variables.value.map(d => d.cve)
  svg.value = d3.select('div#' + props.linea_id + ' svg.svg-lineas')
  grupo_contenedor.value = svg.value.select('g.grupo-contenedor-de-lineas')

  guia_x.value = grupo_contenedor.value.select('line.guia-x')
  guia_y.value = grupo_contenedor.value.select('line.guia-y')

  tooltip.value = d3.select('div#' + props.linea_id).select('div.tooltip')
  eje_x.value = svg.value.select('g.eje-x')
  eje_y.value = svg.value.select('g.eje-y')

  grupo_frente.value = svg.value.select('g.grupo-frente')
  // const grupo_fondo = svg.value.select('g.grupo-fondo')

  configurandoDimensionesParaSVG()
  configurandoDimensionesParaLinea()
  /*this.brush = d3.brushX()
    .extent( [ [0,0], [this.width,this.height] ] )
    .on("end", this.zoomSeleccion)
  this.grupo_contenedor
    .append("g")
    .attr("class","brush")
    .call(this.brush)*/
  creandoLineas()
  actualizandoLineas()

  guia_y.value.attr('x1', 0).attr('y1', 0).attr('x2', ancho.value).attr('y2', 0)
  guia_x.value.attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', alto.value)

  window.addEventListener('resize', reescalandoPantalla)
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
  reescalandoPantalla()
})
</script>

<template>
  <div
    :id="linea_id"
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
    <div
      v-show="logo_conacyt"
      class="grid-column-4 grid-column-6-esc"
    >
      <a
        class="boton boton-conacyt"
        href="https://conacyt.mx/"
        target="_blank"
      >
        <img
          src="https://conacyt.mx/wp-content/uploads/2021/10/logo_conacyt_con_sintagma_azul_completo.svg"
          alt="Conacyt"
          height="28px"
        />
      </a>
    </div>
  </div>
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
</style>
