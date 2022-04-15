<template>
  <div class="contenedor-area">
    <img src="@/assets/imgs/cerrar.svg">
    <div 
      class="dai-contenedor-area"
      v-bind:id="area_id"
    >
      <div class="dai-titulo">
        <h3 class="titulo-visualizacion">Título del proyecto</h3>
        <p class="fecha-actualizacion">Última actualización: {{ fecha_actualizacion }}</p>
        <p class="texto-instruccional">Texto instruccional Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      <div class="contenedor-vis" id="contenedor_vis">
        <div id="contenedor_svg">
          <svg class="svg-area">
            <g class="grupo-contenedor-de-ejes"></g>
            <g class="grupo-contenedor-de-area"></g>          
          </svg>
        </div>
        <div class="tooltip-area" ref="tooltip">
          <div class="contenedor-boton-cerrar">
            <span>{{titulo_tooltip}}</span>
            <button class="boton-cerrar-tooltip" @click="cerrarTooltip()">
              <img src="@/assets/imgs/cerrar.svg" alt="Cerrar Tooltip">
              &times;
            </button>
          </div>
          <p class="tooltip-variable" ref="tooltip_variable"></p>
          <p class="tooltip-cifra" ref="tooltip_cifra">120 | <b> 29.3%</b></p>
        </div>
      </div>
      <div class="dai-info"></div>    
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: 'DaiArea',
  props: {
    area_id: {
      type: String,
      default: () => 'area',
    },
    datos: {
      type: Array,
      default: () => [
        { variable: '2021-01-01', cantidad: '30' },
      ],
    },
    titulo: String,
    instruccional: String,
    fecha_actualizacion: String,
    titulo_eje_y: String,
    titulo_eje_x: String,
    titulo_leyenda: String,
    titulo_tooltip: {
      type: String,
      default: '',
    },
    margin: {
      type: Object,
      default: () => ({
        top: 5,
        right: 15,
        bottom: 35,
        left: 55,
      }),
    },
    variables: {
      type: Array,
      default: function () {
        return ['variable', 'cantidad'];
      },
    },
    color_area: String,
  },
  watch: {

  },
  data() {
    return {
      datas: [],
      width_limit: 769,
    }
  },
  mounted() {
    // Asignando datos
    this.datas = this.datos;
    // Asigna elementos a variables
    this.svg = d3.select(`div#${this.area_id} svg.svg-area`);
    this.grupo_contenedor = this.svg.select('g.grupo-contenedor-de-area');
    this.grupo_contenedor_ejes = this.svg.select('g.grupo-contenedor-de-ejes');

    this.texto_x = this.grupo_contenedor_ejes.append('text')
      .text(this.titulo_eje_x)
      .attr('class', 'label-x')
      .style('font-weight', '600');
    this.texto_y = this.grupo_contenedor_ejes.append('text')
      .text(this.titulo_eje_y)
      .attr('class', 'label-y')
      .style('font-weight', '600');

    // append and attribute class to axes
    this.eje_x = this.grupo_contenedor_ejes
      .append('g')
        .attr('class', 'eje-x');
    this.eje_y = this.grupo_contenedor_ejes
      .append('g')
        .attr('class', 'eje-y');

    this.configurandoDimensionesParaSVG();

    this.configurandoDimensionesParaArea();

    this.creandoArea();

    this.actualizandoArea();     
    
    this.tooltip = d3.select(this.$refs.tooltip);
    this.tooltip.style('visibility', 'hidden');
  },
  methods: {
    configurandoDimensionesParaSVG() {
      /**
       * Método para configurar las dimensiones del elemento SVG
       */
      this.width = document.getElementById('contenedor_vis').clientWidth 
        - this.margin.left - this.margin.right;
      window.innerWidth >= this.width_limit // 769
        ? this.height = 600 - this.margin.top - this.margin.bottom // Desktop
        : this.height = 400 - this.margin.top - this.margin.bottom; // Mobile

      this.svg
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
        // .style('background-color', '#eee'); // <--- comentar

      this.grupo_contenedor
        .attr('transform',
          `translate(${this.margin.left}, ${this.margin.top})`);
      this.grupo_contenedor_ejes
        .attr('transform',
          `translate(${this.margin.left}, ${this.margin.top})`);
      
      // Labels title
      this.texto_x
        .attr('transform', `translate(${this.width * .5}, ${this.height + 25})`)
        .style('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('dominant-baseline', 'hanging');      
      this.texto_y
        .attr('transform',`translate(${-this.margin.left}, ${this.height * .5}) rotate(-90)`)
        .style('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('dominant-baseline', 'hanging');      
    },
    multiFormat(date) {
      /**
       * Método para traducir el formato de fecha
       */
      this.locale = d3.timeFormatLocale({
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
      });
      this.formatMillisecond = this.locale.format(".%L");
      this.formatSecond = this.locale.format(":%S");
      this.formatMinute = this.locale.format("%I:%M");
      this.formatHour = this.locale.format("%I %p");
      this.formatDay = this.locale.format("%a %d");
      this.formatWeek = this.locale.format("%b %d");
      this.formatMonth = this.locale.format("%b");
      this.formatYear = this.locale.format("%Y");

      return (d3.timeSecond(date) < date ? this.formatMillisecond
          : d3.timeMinute(date) < date ? this.formatSecond
          : d3.timeHour(date) < date ? this.formatMinute
          : d3.timeDay(date) < date ? this.formatHour
          : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? this.formatDay : this.formatWeek)
          : d3.timeYear(date) < date ? this.formatMonth
          : this.formatYear)(date);
    },
    configurandoDimensionesParaArea() {      
      /**
       * Método para configurar dimensiones para área
      */
      this.xValue = d => d.date;
      this.yValue = d => +d.value;
      // Build X scale --> it is a date format
      this.xScale = d3.scaleTime()
        .range([0, this.width])
        .domain(d3.extent(this.datas, (d) => d.date))
        .nice();
      // Build Y scale
      this.yScale = d3.scaleLinear()
        .range([this.height, 0])
        .domain([0, d3.max(this.datas, (d) => +d.value)])
        .nice();

      // Add X axis
      this.xAxis = d3.axisBottom(this.xScale)
        .ticks(6)
        .tickFormat(this.multiFormat)
        .tickSize(-this.height)
        .tickPadding(10);
      // Call X axis
      this.xAxisG = this.eje_x.append('g')
        .attr('transform', `translate(0, ${this.height})`)
        .call(this.xAxis);
      // Remove domain line
      this.xAxisG.selectAll('.domain').remove();
      // Font text
      this.xAxisG.selectAll('.tick text')
          .style('font-family', 'Montserrat')
          .style('font-size', '10px')
          .style('text-transform', 'uppercase');
      // Color lines
      this.xAxisG.selectAll('.tick line')
          .style('stroke', '#C0C0BB');
      
      // Add Y axis
      this.yAxis = d3.axisLeft(this.yScale)
        .tickSize(-this.width);      
      // Call Y axis
      this.yAxisG = this.eje_y.append('g')
        .call(this.yAxis);
      // Remove domain line
      this.yAxisG.selectAll('.domain').remove();
      // Font text
      this.yAxisG
        .selectAll('.tick text')
            .style('font-family', 'Montserrat')
            .style('font-size', '10px');
      // Color lines
      this.yAxisG.selectAll('.tick line')
          .style('stroke', '#C0C0BB');
      
      // Area generator
      this.areaGenerator = d3.area()
        .x((d) => this.xScale(d.date))
        .y0(this.yScale(0))
        .y1((d) => this.yScale(d.value))
        .curve(d3.curveBasis);
    },
    creandoArea() {
      /** 
       * Método para crear los paths del área
      */
      // remove all area created
      this.grupo_contenedor
        .selectAll('path.paths-area')
        .remove();

      // Join path with color values
      this.area = this.grupo_contenedor
          .selectAll('gpaths')
          // .data(this.datas, function (d) { return d.date+':'+d.value; })
          .data(this.datas)
          .enter()
        .append('path')
          .attr('class', (d) => `${d.date} paths-area`)
          // .attr('class', (d) => `paths-area-${d.date.getDate()+'-'+(+d.date.getMonth()+1)+'-'+d.date.getFullYear()}`)
          .style('fill', this.color_area)
        .on('mouseover', (evento, datum) => {
          console.log("mousemove", evento, datum);
          this.mostrarTooltip(evento, datum);
        })
        .on('mousemove',(evento,datum) => this.mostrarTooltip(evento, datum))        
        .on('click',(evento,datum) => {
          console.log("click", evento, datum);
          this.mostrarTooltip(evento, datum);
        });

      this.svg.on('mouseout', this.cerrarTooltip);
    },
    actualizandoArea() {
      /**
       * Método para actualizar los paths trazados del área
      */
      this.area
        // .datum(this.datas, function (d) { return d.date + ':' + d.value; })
        // .attr('d', this.areaGenerator);
        .attr('d', this.areaGenerator(this.datas));
        
    },
    mostrarTooltip(evento, datum) {
      /**
       * Método para desplegar el tooltip
       */
      this.tooltip
        .style('visibility', 'visible')
        .style('left', `${evento.pageX + 5}px`)
        .style('top', `${evento.pageY + 5}px`);
      // console.log('mostrar tooltip');
      // d3.select(this.$refs.tooltip_grupo)
      //   .text("datum.date");
      // d3.select(this.$refs.tooltip_variable)
      //   .text("Fecha:");
      d3.select(this.$refs.tooltip_cifra)
        .html(`Variable: ${datum.date.getDate()+'-'+(+datum.date.getMonth()+1)+'-'+datum.date.getFullYear()} 
          <br/> Cantidad: <b>${datum.value}</b>`);      
      // console.log('datum', datum.date);
      // console.log('evento',evento);
    },
    cerrarTooltip() {
      /**
       * Método para esconder el tooltip
       */
      this.tooltip
        .style('visibility', 'hidden')
        .style('left', '0')
        .style('top', '0');
    },
  },
  computed: {

  }
  
}
</script>

<style lang="scss" scoped>
$border-radius-tarjeta:10px;

.dai-contenedor-area {
  max-width: 450px;
  padding: 10px;
  border: 1px solid #000;
  border-radius: $border-radius-tarjeta;

  display: grid;
  grid-gap: 10px;
  grid-template-areas:
    "titulo"
    "vis"
    "info";
  @media (min-width: 769px) {
    max-width: 1300px;
    grid-template-areas:
      "titulo vis"
      "info vis";
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 1fr 2fr;
  }
 
  .dai-titulo{
    grid-area: titulo;
    @media (min-width: 769px) {  
      border-bottom: 1px solid #ccc;
    }
    p.fecha-actualizacion{
        font-size: 14px;
        font-weight: 600;
        margin: 10px 0 5px 0;
    }

    p.texto-instruccional{
        font-size: 14px;
        font-weight: 300;
        margin: 15px 0;
    }
  }
  .contenedor-vis{
    grid-area: vis;
    .tooltip-area {
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
      p {
          margin: 0;
      }
      button.boton-cerrar-tooltip {
          background: none;
          border: none;
          padding: 0 0 0 5px;
          cursor: pointer;
          max-width: none;
          img {
              width: 30px;
              max-width: none;
              height: 30px;
          }
      }
      div.contenedor-boton-cerrar {
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
  .dai-info{
    grid-area: info;
  }  
}
</style>