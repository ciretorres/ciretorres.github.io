<template>
  <div
    class="contenedor-lineas-complejas"
    v-bind:id="lineas_complejas_id"
    :class="{ 'es-un-estado': esUnEstado }"
  >
    <div class="lineas-header">
      <h3 class="titulo-visualizacion" v-if="titulo">
        {{ titulo }}
      </h3>
      <!-- <p class="fecha-actualizacion" v-if="fecha_actualizacion">
        Última actualización: {{ fecha_actualizacion }}
      </p> -->
    </div>
    <div class="lineas-body">
      <div class="contenedor-svg">
        <svg class="svg-lineas-complejas">
          <defs></defs>
          <g class="grupo-contenedor-de-lineas"></g>
          <!-- <g class="grupo-contenedor-tooltip">
            <foreignObject >
              <div class="tooltip-contenido">
                <div class="contenedor-boton-cerrar">
                  <span>{{titulo_tooltip}}</span>
                  <button class="boton-cerrar-tooltip">
                    <img src="@/assets/img/cerrar.svg" alt="Cerrar Tooltip">
                  </button>
                </div>
                <p class="tooltip-variable">Nombre de variable 2 </p>
                <p class="tooltip-cifra">120 | <b> 29.3%<b></b></b></p>
              </div>
            </foreignObject>
          </g> -->
        </svg>
      </div>
    </div>
    <div class="lineas-footer">
      <div id="leyenda-lineas-complejas">
        <p class="titulo-leyenda">{{ titulo_leyenda }}</p>
        <!-- <div class="label-1" v-for="(variable,i) in variables" :key="variable.id">
          <CheckboxColor :color="variable.color" v-model="lista_filtros_activos[i]" >
          <span class="categoria-texto">{{variable.nombre}}</span>
          </CheckboxColor>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as d3 from 'd3'
// import CheckboxColor from "./CheckboxColor.vue"
export default {
  name: 'Multilinea',
  components: {
    // CheckboxColor
  },
  props: {
    lineas_complejas_id: {
      type: String,
      default: () => 'lineas'
    },
    datos: {
      // type: Array,
      type: Object,
      default: () => [{ nombre: 'Nombre de variable', cantidad_1: 120, cantidad_2: 30 }]
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
      }
    },
    columnas_descargables: {
      type: Array,
      default: () => ['nombre', 'cantidad_1', 'cantidad_2']
    },
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
    notas: {
      type: String
    },
    margen: {
      type: Object,
      default: () => ({
        arriba: 10,
        abajo: 30,
        izquierda: 60,
        derecha: 20
      })
    },
    variables: {
      type: Array,
      default: function () {
        return ['nombre', 'cantidad_1', 'cantidad_2']
      }
    }
  },
  watch: {},
  data: () => ({}),
  mounted() {
    // this.grupo_contenedor = this.svg.select('g.grupo-contenedor-de-lineas');
    /** */

    /**
     * Translate date
     */
    var locale = d3.timeFormatLocale({
      decimal: ',',
      thousands: '.',
      grouping: [3],
      currency: ['€', ''],
      dateTime: '%A, %e %B %Y г. %X',
      date: '%d.%m.%Y',
      time: '%H:%M:%S',
      periods: ['AM', 'PM'],
      days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
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
        'Diciembre'
      ],
      shortMonths: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic'
      ]
    })
    var formatMillisecond = locale.format('.%L'),
      formatSecond = locale.format(':%S'),
      formatMinute = locale.format('%I:%M'),
      formatHour = locale.format('%I %p'),
      formatDay = locale.format('%a %d'),
      formatWeek = locale.format('%b %d'),
      formatMonth = locale.format('%b'),
      formatYear = locale.format('%Y')
    function multiFormat(date) {
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
          ? formatMonth
          : formatYear
      )(date)
    }

    /**
     * Formateando datos
     */
    // Convirtiendo el objeto datos en un arreglo
    // console.log("Imprimiendo this.datos",this.datos)
    // const keysArray = Object.keys(this.datos);
    // console.log("keysArray",keysArray);

    // Obteniendo keys o nombre de la variable columna obj
    const asArray = Object.entries(this.datos)
    // console.log("Array de this.datos",asArray);

    // Convirtiendo los sub objetos de valores en arreglo
    const dateArray = Object.values(asArray[0][1])
    const estadoArray = Object.values(asArray[1][1])
    const varianteArray = Object.values(asArray[2][1])
    const OMSArray = Object.values(asArray[3][1])

    // Construcción de objetoDatos
    function Objeto(estado, fecha_recoleccion, tipo_variante, variante_oms) {
      // Constructor
      this.estado = estado
      this.fecha_recoleccion = fecha_recoleccion
      this.tipo_variante = tipo_variante
      this.variante_oms = variante_oms
    }

    // Creando arrelgo de Objetos
    var dataBase = []
    for (var i = 0; i < dateArray.length; i++) {
      // Asignando la creación de objeto
      var nuevoObjeto = new Objeto(estadoArray[i], dateArray[i], varianteArray[i], OMSArray[i])
      dataBase.push(nuevoObjeto)
    }
    // console.log("dataBase",dataBase);

    /**
     * Filtrando baseDatos por fecha_recolección
     * this.fecha_actualización '2021-04-30' -6 en mes
     * */
    const dateFiltered = dataBase.filter((d) => d.fecha_recoleccion > '2020-12-31')
    // console.log("fecha_actualización",this.fecha_actualizacion);
    // console.log("dateFiltered",dateFiltered);
    /**
     * Función para Parse el tiempo
     * */
    var parseTime = d3.timeParse('%Y-%m-%d')
    var date = []
    dateFiltered.forEach((d) => {
      // Push ParseDateFiltered to dateArray
      date.push(parseTime(d.fecha_recoleccion))
    })

    // Filtrar por estado

    /**
     * CASO 1 - Selección por tipo de variante: VOC
     * Caso resuelto para filtrar cada key object de tipo de variante.
     *  */
    // const vocDatosFiltered = dateFiltered.filter(d => d.tipo_variante == 'VOC');
    // const voidateFiltered = dateFiltered.filter(d => d.tipo_variante == 'VOI');
    // const vinDatosFiltered = dateFiltered.filter(d => d.tipo_variante == 'VIN');
    // const vomDatosFiltered = dateFiltered.filter(d => d.tipo_variante == 'VOM');
    // const vsinDatosFiltered = dateFiltered.filter(d => d.tipo_variante == 'VSIN');
    // console.log("VOC", vocDatosFiltered);
    // console.log("VOI", voidateFiltered);
    // console.log("VIN", vinDatosFiltered);
    // console.log("VIM", vomDatosFiltered);
    // console.log("VSIN", vsinDatosFiltered);
    // let grupos2 = {};
    // voiDatosFiltered.forEach( d => {
    //   const nombreGrupo = d.fecha_recoleccion;
    //   if (!grupos2[nombreGrupo]) grupos2[nombreGrupo] = [];
    //   grupos2[nombreGrupo].push(d);
    // })
    // Agrupando objetos clave del arreglo por propiedad: tipo_variante
    let groupObj = {}
    dateFiltered.forEach((alumno) => {
      const nombreGrupo = alumno.tipo_variante
      if (!groupObj[nombreGrupo]) groupObj[nombreGrupo] = []
      groupObj[nombreGrupo].push(alumno)
    })
    // console.log("groupObject Keys",Object.keys(groupObj));

    // Agrupando conjuntos
    let keysGroupArray = []
    for (var i = 0; i < Object.keys(groupObj).length; i++) {
      // Filtrando por tipo_variante
      var keyFiltered = dateFiltered.filter((d) => d.tipo_variante == Object.keys(groupObj)[i])
      // console.log(Object.keys(groupObj)[i],keyFiltered);
      let keyGroup = {}
      // Agrupando objetos del arreglo por propiedad: fecha_recoleccion
      keyFiltered.forEach((d) => {
        const nombreGrupo = d.fecha_recoleccion
        if (!keyGroup[nombreGrupo]) keyGroup[nombreGrupo] = []
        // keyGroup[nombreGrupo].push([d.fecha_recoleccion, d.tipo_variante]);
        keyGroup[nombreGrupo].push(d)
      })
      // console.log("keyGroup",keyGroup);
      // Re-agrupando objetos clave del arreglo por propiedad: tipo_variante
      let keyGroup2 = {}
      Object.entries(keyGroup).forEach((d) => {
        const nombreGrupo = d[1][0].tipo_variante
        if (!keyGroup2[nombreGrupo]) keyGroup2[nombreGrupo] = []
        // keyGroup[nombreGrupo].push([d.fecha_recoleccion, d.tipo_variante]);
        keyGroup2[nombreGrupo].push(d)
      })
      // console.log("keyGroup2",keyGroup2);
      keysGroupArray.push(keyGroup2)
    }
    // console.log("ArrayObjetoLineas",keysGroupArray);
    // console.log("ArrayObjetoLineas",keysGroupArray[0]);
    // console.log("ArrayObjetoLineas",keysGroupArray[0].VSIN);
    // console.log("ArrayObjetoLineas",keysGroupArray[0].VSIN[0]);
    // console.log("ArrayObjetoLineas",keysGroupArray[0].VSIN[0][0]);
    // console.log("ArrayObjetoLineas",keysGroupArray[0].VSIN[0][1]);
    // console.log("ArrayObjetoLineas",parseTime(keysGroupArray[0].VSIN[0][0]));
    // console.log("ArrayObjetoLineas",keysGroupArray[0].VSIN[0][1].length);

    // console.log("ArrayObjetoLineas",Object.values(keysGroupArray[1]));
    // console.log("ArrayObjetoLineas",Object.entries(keysGroupArray[1]));
    // Object.values(keysGroupArray[1]).forEach(d => {
    //   console.log(d[0][0], d[0][1]);
    // })

    // Construcción de objetoDatos
    function ObjetoLinea(fecha_recoleccion, tipo_variante_cantidad) {
      // Constructor
      this.fecha_recoleccion = fecha_recoleccion
      this.tipo_variante_cantidad = tipo_variante_cantidad
    }
    // Agrupando valores para el arreglo de objetos de lineasGrafica
    var lineasArraysObj = []
    for (var i = 0; i < keysGroupArray.length; i++) {
      var lineaArrays = []

      for (var j = 0; j < keysGroupArray[i].length; j++) {
        var nuevoObjeto = new ObjetoLinea(
          parseTime(keysGroupArray[i][j][0]),
          keysGroupArray[i][j][1].length
        )
        // console.log(j);
        lineaArrays.push(nuevoObjeto)
      }
      lineasArraysObj.push(lineaArrays)
    }
    // console.log("lineaArraysObj",lineasArraysObj);

    /**
     * SVG d3.js
     */
    // set the dimensions and margins of the graph
    var margin = { top: 5, right: 20, bottom: 20, left: 40 },
      width =
        document.getElementById(this.lineas_complejas_id).clientWidth - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom

    // append the svg object to the body of the page
    var svg = d3
      .select(`div#${this.lineas_complejas_id} svg.svg-lineas-complejas`)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('background-color', '#efefef')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // Add Y axis
    var y = d3.scaleLinear().range([height, 0])
    // y.domain([0, 4000]); // Cambiar máximo
    y.domain([0, 160]) // Cambiar máximo menos 10
    svg.append('g').call(d3.axisLeft(y).ticks(5).tickSize(0)).style('color', '#000')
    // Draw Y lines
    svg
      .append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y).tickSize(-width, 0, 0).tickFormat('').ticks(4))
      .style('opacity', '0.3')
      .style('color', '#000')

    // Add X axis --> it is a date format
    var x = d3.scaleTime().range([0, width])
    x.domain(
      d3.extent(date, function (d) {
        return d
      })
    )
    // x.domain([new Date(2021, 0, 1), new Date(2022, 0, 1)])
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      // .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")))
      // .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b")).tickSize(0))
      // .call(d3.axisBottom(x))
      .call(d3.axisBottom(x).tickFormat(multiFormat).tickSize(0))
      .selectAll('text')
      .style('text-anchor', 'start')
      .style('text-transform', 'uppercase')
      // .attr("transform",
      //         function() { return "rotate(0)"; })
      .attr('transform', 'translate(0,' + 5 + ')')
      .style('color', '#000')
    // Draw X lines
    svg
      .append('g')
      .attr('class', 'grid')
      .attr('transform', 'translate(0,' + height + ')')
      .call(
        d3
          .axisBottom(x)
          // .tickSize(-height)
          .tickSize(-height, 0, 0)
          .tickFormat('')
          .ticks(6)
      )
      .style('opacity', '0.3')
      .style('color', '#000')

    /**
     * Dibujando líneas
     */
    // Add the line 0 VSIN
    svg
      .append('path')
      // .datum(data)
      .datum(keysGroupArray[0].VSIN)
      .attr('fill', 'none')
      // .attr("stroke", "steelblue")
      .attr('stroke', this.variables[0].color)
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .line()
          // .x(function(d) { return x(d.date) })
          // .y(function(d) { return y(d.value )})
          .x(function (d) {
            // console.log(parseTime(d[0]))
            return x(parseTime(d[0]))
          })
          .y(function (d) {
            // console.log(d[1].length)
            return y(d[1].length)
          })
      )

    // Add the line 1 VIN
    svg
      .append('path')
      .datum(keysGroupArray[1].VIN)
      .attr('fill', 'none')
      .attr('stroke', this.variables[1].color)
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .line()
          .x(function (d) {
            return x(parseTime(d[0]))
          })
          .y(function (d) {
            return y(d[1].length)
          })
      )
    // Add the line 2 VOM
    svg
      .append('path')
      .datum(keysGroupArray[2].VOM)
      .attr('fill', 'none')
      .attr('stroke', this.variables[2].color)
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .line()
          .x(function (d) {
            return x(parseTime(d[0]))
          })
          .y(function (d) {
            return y(d[1].length)
          })
      )
    // Add the line 3 VOC
    svg
      .append('path')
      .datum(keysGroupArray[3].VOC)
      .attr('fill', 'none')
      .attr('stroke', this.variables[3].color)
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .line()
          .x(function (d) {
            return x(parseTime(d[0]))
          })
          .y(function (d) {
            return y(d[1].length)
          })
      )
    // Add the line 4 VOI
    svg
      .append('path')
      .datum(keysGroupArray[4].VOI)
      .attr('fill', 'none')
      .attr('stroke', this.variables[4].color)
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .line()
          .x(function (d) {
            return x(parseTime(d[0]))
          })
          .y(function (d) {
            return y(d[1].length)
          })
      )
  },
  methods: {},
  computed: {
    esUnEstado() {
      return this.datos.length === 1
    }
  }
}
/* eslint-enable */
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '@/scss/app.scss';
$border-radius-tarjeta: 10px;
.titulo-visualizacion {
  font-size: 16px;
  // font-size: map-get($fuente, "size-primario");
  padding: 10px;
  margin: 0;
}
p.fecha-actualizacion {
  font-size: 12px;
  // font-size: map-get($fuente, "size-notas");
  padding: 0 10px;
  margin: 5px 0;
}
div.contenedor-lineas-complejas {
  // font-family: "Montserrat";
  width: 100%;
  // border: solid black 1px;
  // border-radius: $border-radius-tarjeta;
  @media (min-width: 769px) {
    &.es-un-estado {
      display: grid;
      grid-template-areas:
        'header body'
        'footer body';
      grid-template-columns: 300px 1fr;
      grid-template-rows: auto 1fr;
      .lineas-header {
        grid-area: header;
        border-right: 1px solid black;
      }
      .lineas-body {
        grid-area: body;
      }
      .lineas-footer {
        grid-area: footer;
        border-right: 1px solid black;
        border-top: 1px solid black;
        div#leyenda-lineas-complejas {
          box-shadow: none;
          > div {
            width: 50%;
            flex: 0 0 50%;
          }
        }
      }
    }
  }
}
div#leyenda-lineas-complejas {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  border-radius: $border-radius-tarjeta;
  // box-shadow: 0px -5px 5px -1px rgb(221, 221, 221);
  margin-bottom: 10px;
  justify-content: center;
  p.titulo-leyenda {
    width: 100%;
    margin-bottom: 5px;
    text-align: center;
    font-size: 12px;
    // font-size: map-get($fuente, "size-notas");
    font-weight: 700;
  }
  div {
    margin-top: 10px;
    width: 16%;
    -ms-flex: 0 0 16%;
    flex: 0 0 16%;
    max-width: calc(50% - 20px);
    padding: 0px 10px;
    display: flex;
    span.categoria-color {
      width: 25px;
      height: 25px;
      min-width: 25px;
      display: inline-block;
      border-radius: 50%;
      position: relative;
    }
    span.categoria-texto {
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
      span.categoria-color {
        background: #dbdbdb !important;
      }
    }
  }
}
</style>
