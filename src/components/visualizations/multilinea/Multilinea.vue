<script setup>
import * as d3 from 'd3'
import { onMounted } from 'vue';

// import CheckboxColor from '@/components/utils/CheckboxColor.vue'

const props = defineProps({
  lineas_complejas_id: {
    type: String,
    default: () => 'lineas',
  },
  datos: {
    // type: Array,
    type: Object,
    default: () => [
      { nombre: 'Nombre de variable', cantidad_1: 120, cantidad_2: 30 },
    ],
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
      return { nombre: 'nombre' };
    },
  },
  columnas_descargables: {
    type: Array,
    default: () => ['nombre', 'cantidad_1', 'cantidad_2'],
  },
  titulo_tooltip: {
    type: String,
    default: '',
  },
  alto_vis: {
    type: Number,
    default: 500,
  },
  ancho_vis: {
    type: Number,
    default: 500,
  },
  notas: {
    type: String,
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
  variables: {
    type: Array,
    default: function () {
      return ['nombre', 'cantidad_1', 'cantidad_2'];
    },
  },
})

function esUnEstado() {
  return props.datos.length === 1;
}
/**
 * Translate date
 */
function multiFormat(date) {
  const locale = d3.timeFormatLocale({
    "decimal": ",",
    "thousands": ".",
    "grouping": [3],
    "currency": ["€", ""],
    "dateTime": "%A, %e %B %Y г. %X",
    "date": "%d.%m.%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    "shortDays": ["Dom", "Lun", "Mar", "Mi", "Jue", "Vie", "Sab"],
    "months": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    "shortMonths": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  })

  const formatMillisecond = locale.format(".%L"),
    formatSecond = locale.format(":%S"),
    formatMinute = locale.format("%I:%M"),
    formatHour = locale.format("%I %p"),
    formatDay = locale.format("%a %d"),
    formatWeek = locale.format("%b %d"),
    formatMonth = locale.format("%b"),
    formatYear = locale.format("%Y")

  return (d3.timeSecond(date) < date ? formatMillisecond
      : d3.timeMinute(date) < date ? formatSecond
      : d3.timeHour(date) < date ? formatMinute
      : d3.timeDay(date) < date ? formatHour
      : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
      : d3.timeYear(date) < date ? formatMonth
      : formatYear)(date)
}
/**
 * Construcción de objetoDatos
*/
function Objeto(estado, fecha_recoleccion, tipo_variante, variante_oms){
  // Constructor
  return {
    'estado': estado,
    'fecha_recoleccion': fecha_recoleccion,
    'tipo_variante': tipo_variante,
    'variante_oms': variante_oms
  }
}
/**
 * Construcción de objetoLinea
*/
function ObjetoLinea(fecha_recoleccion, tipo_variante_cantidad){
  // Constructor
  return {
    'fecha_recoleccion': fecha_recoleccion,
    'tipo_variante_cantidad': tipo_variante_cantidad
  }
}  

onMounted(() => {
  /**
   * Formateando datos
   */

  // Obteniendo keys o nombre de la variable columna obj
  const asArray = Object.entries(props.datos)  
  // console.log("asArray",asArray);

  // Convirtiendo los sub objetos de valores en arreglo
  const dateArray = Object.values(asArray[0][1])
  const estadoArray = Object.values(asArray[1][1])
  const varianteArray = Object.values(asArray[2][1])
  const OMSArray = Object.values(asArray[3][1])

  // Creando arrelgo de Objetos
  const dataBase = [];
  for(let i = 0; i < dateArray.length; i++){
    const nuevoObjeto = Objeto(
      estadoArray[i], 
      dateArray[i], 
      varianteArray[i], 
      OMSArray[i]
    )
    dataBase.push(nuevoObjeto)
  }
  // console.log("dataBase",dataBase);

  /** 
   * Filtrando baseDatos por fecha_recolección
   * this.fecha_actualización '2021-04-30' -6 en mes
   */ 
  const dateFiltered = dataBase.filter(d => d.fecha_recoleccion > '2020-12-31')
  // console.log("dateFiltered",dateFiltered)

  /** 
   * Función para Parse el tiempo
   */ 
  const parseTime = d3.timeParse("%Y-%m-%d")

  const date = []

  dateFiltered.forEach(d => {
    // Push ParseDateFiltered to dateArray
    date.push(parseTime(d.fecha_recoleccion))
  })

  // TODO: Filtrar por estado
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
  const groupObj = {}

  dateFiltered.forEach(alumno => {
    const nombreGrupo = alumno.tipo_variante    
    if (!groupObj[nombreGrupo]) groupObj[nombreGrupo] = []
    groupObj[nombreGrupo].push(alumno)
  })
  // console.log("Object.keys(groupObj)",Object.keys(groupObj))

  // Agrupando conjuntos
  const keysGroupArray = []

  for(let i = 0; i < Object.keys(groupObj).length; i++){
    // Filtrando por tipo_variante
    const keyFiltered = dateFiltered.filter(d => d.tipo_variante == Object.keys(groupObj)[i])
    const keyGroup = {}
    
    // Agrupando objetos del arreglo por propiedad: fecha_recoleccion
    keyFiltered.forEach( d => {
      const nombreGrupo = d.fecha_recoleccion
      if (!keyGroup[nombreGrupo]) keyGroup[nombreGrupo] = []
      keyGroup[nombreGrupo].push(d)
    })
    // console.log("keyGroup",keyGroup)
    
    // Re-agrupando objetos clave del arreglo por propiedad: tipo_variante
    const keyGroup2 = {}

    Object.entries(keyGroup).forEach(d => {
      const nombreGrupo = d[1][0].tipo_variante      
      if (!keyGroup2[nombreGrupo]) keyGroup2[nombreGrupo] = []
      keyGroup2[nombreGrupo].push(d)
    })
    // console.log("keyGroup2",keyGroup2)
    keysGroupArray.push(keyGroup2)
  }

  /**
   * SVG d3.js
  */
  // set the dimensions and margins of the graph
  const margin = { top: 5, right: 20, bottom: 20, left: 40 },
    width = document.getElementById(props.lineas_complejas_id).clientWidth - margin.left - margin.right, 
    height = 250 - margin.top - margin.bottom

  // append the svg object to the body of the page
  const svg = d3.select(`div#${props.lineas_complejas_id} svg.svg-lineas-complejas`)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      // .style("background-color", "#efefef") // Fondo comentar
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  // Add Y axis
  const y = d3.scaleLinear()
      .range([height, 0])
    // y.domain([0, 4000]); // Cambiar máximo

  y.domain([0, 160]) // Cambiar máximo menos 10

  svg.append("g")
    .call( d3.axisLeft(y).ticks(5).tickSize(0) )
    .style("color", "#efefef")

  // Draw Y lines
  svg.append("g")         
    .attr("class", "grid")
    .call(d3.axisLeft(y)
      .tickSize(-width, 0, 0)
      .tickFormat("")
      .ticks(4)
    )
    .style("opacity", "0.3")
    .style("color", "#efefef")

  // Add X axis -> it is a date format
  const x = d3.scaleTime()
    .range([0, width])

  x.domain( d3.extent(date, function(d) { return d; }) )

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")      
    // .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")))
    // .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b")).tickSize(0))
    // .call(d3.axisBottom(x))
    .call( d3.axisBottom(x).tickFormat(multiFormat).tickSize(0) )            
    .selectAll("text")
    .style("text-anchor", "start")
    .style("text-transform", "uppercase")
    // .attr("transform", 
    //         function() { return "rotate(0)"; })
    .attr("transform", "translate(0," + 5 + ")")
    .style("color", "#efefef")
  
  // Draw X lines
  svg.append("g")         
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
      // .tickSize(-height)
      .tickSize(-height, 0, 0)
      .tickFormat("")
      .ticks(6)
    )
    .style("opacity", "0.3")
    .style("color", "#efefef")

  /**
   * Dibujando líneas
   */      
  // Add the line 0 VSIN
  svg.append("path")
    // .datum(data)
    .datum(keysGroupArray[0].VSIN)
    .attr("fill", "none")
    // .attr("stroke", "steelblue")
    .attr("stroke", props.variables[0].color)   
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      // .x(function(d) { return x(d.date) })
      // .y(function(d) { return y(d.value )})
      .x(function(d) { 
        // console.log(parseTime(d[0]))
        return x(parseTime(d[0])) 
        })
      .y(function(d) { 
        // console.log(d[1].length)
        return y(d[1].length)
      })
    )

  // Add the line 1 VIN
  svg.append("path")
    .datum(keysGroupArray[1].VIN)
    .attr("fill", "none")
    .attr("stroke", props.variables[1].color)      
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { 
        return x(parseTime(d[0])) 
        })
      .y(function(d) { 
        return y(d[1].length)
      })
    )
  
  // Add the line 2 VOM
  svg.append("path")
    .datum(keysGroupArray[2].VOM)
    .attr("fill", "none")
    .attr("stroke", props.variables[2].color)      
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { 
        return x(parseTime(d[0])) 
        })
      .y(function(d) { 
        return y(d[1].length)
      })
    )

  // Add the line 3 VOC
  svg.append("path")
    .datum(keysGroupArray[3].VOC)
    .attr("fill", "none")
    .attr("stroke", props.variables[3].color)      
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { 
        return x(parseTime(d[0])) 
        })
      .y(function(d) { 
        return y(d[1].length)
      })
    )

  // Add the line 4 VOI
  svg.append("path")
  .datum(keysGroupArray[4].VOI)
  .attr("fill", "none")
  .attr("stroke", props.variables[4].color)      
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(function(d) { 
      return x(parseTime(d[0])) 
      })
    .y(function(d) { 
      return y(d[1].length)
    })
  )
})
</script>

<template>
  <div
    class="contenedor-lineas-complejas"
    v-bind:id="lineas_complejas_id"
    :class="{ 'es-un-estado': esUnEstado }"
  >
    <div class="lineas-header">
      <h1 class="" v-if="titulo">{{ titulo }}</h1>
      <p class="fecha-actualizacion" v-if="fecha_actualizacion">
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
        <p class="titulo-leyenda">{{titulo_leyenda}}</p>
        <!-- <div class="label-1" v-for="(variable,i) in variables" :key="variable.id">
          <CheckboxColor :color="variable.color" v-model="lista_filtros_activos[i]" >
          <span class="categoria-texto">{{variable.nombre}}</span>
          </CheckboxColor>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/app.scss';
  $border-radius-tarjeta: 10px;
  .titulo-visualizacion {
    font-size: 16px;
    // font-size: map-get($fuente, "size-primario");
    padding: 10px;
    margin: 0;
  }
  p.fecha-actualizacion{
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
      &.es-un-estado{
        // display: grid;
        grid-template-areas: "header body"
                            "footer body";
        grid-template-columns: 300px 1fr;
        grid-template-rows: auto 1fr;
        .lineas-header{
          grid-area: header;
          // border-right: 1px solid black;
        }
        .lineas-body{
          grid-area: body;
        }
        .lineas-footer{
          grid-area: footer;
          // border-right: 1px solid black;
          // border-top: 1px solid black;
          div#leyenda-lineas-complejas{
            box-shadow: none;
            >div{
              width: 50%;
              flex: 0 0 50%;
            }
          }
        }
      }
    }

  }
  div#leyenda-lineas-complejas{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    border-radius: $border-radius-tarjeta;
    // box-shadow: 0px -5px 5px -1px rgb(221, 221, 221);
    margin-bottom:10px;
    justify-content: center;
    p.titulo-leyenda{
      width: 100%;
      margin-bottom: 5px;
      text-align: center;
      font-size: 12px;
      // font-size: map-get($fuente, "size-notas");
      font-weight: 700;
    }
    div{
      margin-top: 10px;
      width: 16%;
      -ms-flex: 0 0 16%;
      flex: 0 0 16%;
      max-width: calc(50% - 20px);
      padding: 0px 10px;
      display: flex;
      span.categoria-color{
        width: 25px;
        height: 25px;
        min-width: 25px;
        display: inline-block;
        border-radius: 50%;
        position: relative;
      }
      span.categoria-texto{
        display: inline-block;
        position: relative;
        padding-left: 5px;
        font-size: 10px;
        top: 50%;
        transform: translateY(-50%);
        margin-bottom: auto;
      }
      &.active{
        color:#000;
      }
      &.inactive{
        color:gray;
        span.categoria-color{
          background:#dbdbdb!important;
        }
      }
    }
  }
</style>
