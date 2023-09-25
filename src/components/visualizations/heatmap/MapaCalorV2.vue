<template>
  <div
    class="mapa-calor"
    v-bind:id="mapa_calor_id"
  >
    <div class="titulo-calor">
      <h3 class="titulo-visualizacion">
        <span v-if="varianteSeleccionada=='VTODAS'">
          Número de casos relacionados con todas las variantes por estado
        </span>
        <span v-if="varianteSeleccionada=='VIN'">
          Número de casos relacionados con las variantes de interés nacional (VIN) por estado
        </span>
        <span v-if="varianteSeleccionada=='VOC'">
          Número de casos relacionados con las variantes de preocupación (VOC) por estado
        </span>
        <span v-if="varianteSeleccionada=='VOI'">
          Número de casos relacionados con las variantes de interés (VOI) por estado
        </span>
        <span v-if="varianteSeleccionada=='VOM'">
          Número de casos relacionados con las variantes de monitoreo (VOM) por estado
        </span>
        <span v-if="varianteSeleccionada=='VSIN'">
          Número de casos relacionados con las variantes sin clasificación (VSIN) por estado
        </span>
      </h3>
      <p class="instruccional">Última actualización: 05/07/2021</p>
    </div>
    <div class="nomenclatura">
      <div class="leyenda-mapa-calor">
        <p class="titulo-leyenda">
          Casos relacionados de la muestra
        </p>
        <button @click="quitaPon" class="quita-pon">{{status_button}}</button>
      </div>
      <div class="checks">
        <div class="label-1" v-for="(variable,i) in variables_grafica" :key="variable.id">
          <CheckboxColor :color="variable.color" v-model="lista_filtros_activos[i]" >
            <span class="categoria-texto">{{variable.nombre}}</span>
          </CheckboxColor>
        </div>
      </div>
    </div>
    <div class="contenedor-vis" id="contenedor_vis">
      <!-- svg -->
      <div id="contenedor_svg">
        <svg class="svg-heatmap">
          <g class="grupo-contenedor-de-heatmap"></g>
          <g class="grupo-contenedor-de-ejes"></g>
        </svg>
      </div>
      <!-- tooltip -->
      <div class="tooltip-mapa-calor" ref="tooltip">
        <div class="contenedor-boton-cerrar">
          <span>{{titulo_tooltip}}</span>
          <button class="boton-cerrar-tooltip" @click="cerrarTooltip()">
            <img src="@/assets/img/cerrar.svg" alt="Cerrar Tooltip">
          </button>
        </div>
        <p class="tooltip-variable" ref="tooltip_variable"> </p>
        <p class="tooltip-cifra" ref="tooltip_cifra">120 | <b> 29.3%</b></p>
      </div>
    </div>
  </div>
</template>

<script>

import * as d3 from 'd3';

import { mapState } from 'vuex';

import CheckboxColor from '@/components/utils/CheckboxColor.vue';

import consorcioHeatmap from '@/assets/datasets/consorcio_heatmap.json';
import consorcioVariantesHeatmapTodas from '@/assets/datasets/consorcio_variantes_heatmap_todas.json';

const dictValuesRango = {
  Rango_0: '0',
  Rango_1: '0 a 19',
  Rango_2: '20 a 39',
  Rango_3: '40 a 59',
  Rango_4: '60 a 79',
  Rango_5: '80 o más',
};
const dictColorsRango = {
  Rango_0: '#EAD8D8',
  Rango_1: '#FEB7C5',
  Rango_2: '#EB5382',
  Rango_3: '#E31755',
  Rango_4: '#A71867',
  Rango_5: '#7B053B',
};
const variables = Object.entries(dictValuesRango).map((rango) => {
  return {
    color: dictColorsRango[rango[0]],
    nombre: rango[1],
    id: rango[0],
  };
});

export default {
  name: 'MapaCalor',
  components: {
    CheckboxColor,
  },
  props: {
    mapa_calor_id: {
      type: String,
      default: () => 'mapa_calor',
    },
    datos: {
      type: Array,
      // type: Object,
      default: () => [
        { grupo: 'A', variable: 'v1', cantidad: '30' },
      ],
    },
    titulo: String,
    instruccional: String,
    fecha_actualizacion: String,
    titulo_leyenda: String,
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
    margin: {
      type: Object,
      default: () => ({
        top: 10,
        right: 0,
        bottom: 40,
        left: 40,
      }),
    },
    variables: {
      type: Array,
      default: function () {
        return ['grupo', 'variable', 'cantidad'];
      },
    },
  },
  data() {
    return {
      variables_grafica: variables,
      width: 100,
      height: 100,
      width_limit: 769,
      lista_filtros_activos: [],
      status_button: 'Quitar todos',
    };
  },
  computed: {
    // Declara variante_seleccionada para utilizar la función en watch
    ...mapState(['variante_seleccionada']),
    // Declara función para utilizar su valor en todo el componente
    varianteSeleccionada() {
      return this.$store.getters.varianteSeleccionada;
    },
  },
  watch: {
    lista_filtros_activos() {
      // Dependiendo del valor de la lista de filtro
      // asigna el id o colócalo vacío. Solo manda los que no están vacíos.
      this.categorias_checkeadas = this.variables_grafica.map((d, i) => this.lista_filtros_activos[i] ? d.id : '').filter((d) => d !== '');
      // console.log(this.categorias_checkeadas);

      this.configurandoDimensionesParaSVG();
      this.calculoHeatmap(this.varianteSeleccionada);
      this.configurandoDimensionesParaHeatmap();
      if (window.innerWidth >= this.width_limit) {
        this.creandoHeatmapDesktop();
      } else {
        this.creandoHeatmapMobile();
      }
      this.actualizandoHeatmap();
    },

    variante_seleccionada(newValue) {
      // Variante seleccionada proveniente del estado del store
      // console.log('variante_seleccionada', newValue); VTODAS

      this.configurandoDimensionesParaSVG();
      this.calculoHeatmap(newValue);
      this.configurandoDimensionesParaHeatmap();

      if (window.innerWidth >= this.width_limit) {
        this.creandoHeatmapDesktop();
      } else {
        this.creandoHeatmapMobile();
      }

      this.actualizandoHeatmap();
    },
  },
  mounted: function () {
    // Asigna todas las variables de filtro de input en checked
    this.lista_filtros_activos = this.variables_grafica.map(() => true);
    // Dependiendo del valor de la lista de filtro
    //  asigna el id o colócalo vacío. Solo manda los que no están vacíos.
    this.categorias_checkeadas = this.variables.map((d, i) => this.lista_filtros_activos[i] ? d.id : '').filter((d) => d !== '');

    // Asigna elementos a variables
    this.svg = d3.select(`div#${this.mapa_calor_id} svg.svg-heatmap`);
    this.grupo_contenedor = this.svg.select('g.grupo-contenedor-de-heatmap');
    this.grupo_contenedor_ejes = this.svg.select('g.grupo-contenedor-de-ejes');

    // append and attribute class to axes
    this.eje_x_top = this.grupo_contenedor_ejes
      .append('g')
      .attr('class', 'eje-x-top');
    this.eje_x_bottom = this.grupo_contenedor_ejes
      .append('g')
      .attr('class', 'eje-x-bottom');
    this.eje_y = this.grupo_contenedor_ejes
      .append('g')
      .attr('class', 'eje-y');
    this.eje_y_abr = this.grupo_contenedor_ejes
      .append('g')
      .attr('class', 'eje-y-abr');

    this.configurandoDimensionesParaSVG();
    this.calculoHeatmap(this.varianteSeleccionada);
    this.configurandoDimensionesParaHeatmap();
    if (window.innerWidth >= this.width_limit) {
      this.creandoHeatmapDesktop();
    } else {
      this.creandoHeatmapMobile();
    }
    this.actualizandoHeatmap();
  },
  methods: {
    configurandoDimensionesParaSVG() {
      /**
       * Método para configurar las dimensiones del elemento SVG
       */
      // set the dimensions with margins to the graph
      this.width = document.getElementById('contenedor_vis').clientWidth - this.margin.left - this.margin.right;
      if (window.innerWidth >= this.width_limit) { // 769
        this.height = 400 - this.margin.top - this.margin.bottom; // Desktop
      } else {
        this.height = 600 - this.margin.top - this.margin.bottom; // Mobile
      }

      this.svg
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      // .style('background-color', '#eee') // <-- comentar

      this.grupo_contenedor
        .attr('transform',
          `translate(${this.margin.left}, ${this.margin.top})`);
    },
    calculoHeatmap(tipoVariante) {
      /**
       * Método para calcular los valores del heatmap
       * dependiendo del tipo de variante o si son todas
      */

      if (tipoVariante === 'VTODAS') {
        // Asignando database
        this.datosJSON = consorcioVariantesHeatmapTodas;
        // console.log('this.datosJSON', this.datosJSON);

        // Creando keysArray para estado, tipo_variante y abreviatura_ent
        const groupEstado = {};
        Object.values(this.datosJSON).forEach((alumno) => {
          const nombreGrupo = alumno.estado;
          if (!groupEstado[nombreGrupo]) groupEstado[nombreGrupo] = [];
          groupEstado[nombreGrupo].push(alumno);
        });
        const keyEstado = Object.keys(groupEstado);
        // console.log("keyEstado",keyEstado);
        const groupTipoVariante = {};
        Object.values(this.datosJSON).forEach((alumno) => {
          const nombreGrupo = alumno.tipo_variante;
          if (!groupTipoVariante[nombreGrupo]) groupTipoVariante[nombreGrupo] = [];
          groupTipoVariante[nombreGrupo].push(alumno);
        });
        this.keyTipoVariante = Object.keys(groupTipoVariante);
        this.keyVariante = this.keyTipoVariante;
        // console.log("keyTipoVariante",this.keyTipoVariante);
        const groupAbreviaturaEnt = {};
        Object.values(this.datosJSON).forEach((alumno) => {
          const nombreGrupo = alumno.abreviatura_ent;
          if (!groupAbreviaturaEnt[nombreGrupo]) groupAbreviaturaEnt[nombreGrupo] = [];
          groupAbreviaturaEnt[nombreGrupo].push(alumno);
        });
        this.keyAbreviatura = Object.keys(groupAbreviaturaEnt);
        // console.log("keyAbreviatura",this.keyAbreviatura);

        // this.completo = ['Interés nacional', 'Preocupación', 'Monitoreo', 'Sin clasificación', 'Interés'];
        // this.parentesis = ['(VIN)', '(VOC)', '(VOM)', '(VSIN)', '(VOI)'];
        this.completo = ['Preocupación', 'Interés', 'Interés nacional',  'Monitoreo', 'Sin clasificación'];
        this.parentesis = ['(VOC)', '(VOI)', '(VIN)', '(VOM)', '(VSIN)'];

        // Creando un nuevo arreglo de objectos con las claves ya filtradas y sumadas
        const arregloObjectos = [];
        for (let i = 0; i < keyEstado.length; i++) {
          // Recorre por el número de estados y asigna el conjunto filtrado
          const filtroEstado = Object.values(this.datosJSON)
            .filter((d) => d.estado === keyEstado[i]);         

          for (let j = 0; j < this.keyTipoVariante.length; j++) {
            // Recorre por el número de tipo de variantes asignando el conjunto filtrado
            // y recorre el conjunto para sumar la cantidad de muestras en total
            const filtroTipoVariante = filtroEstado
              .filter((d) => d.tipo_variante === this.keyTipoVariante[j]);
            let valor = 0;
            filtroTipoVariante.forEach((element) => {
              // valor += element.cantidad_muestras;
              // valor += parseFloat(element.cantidad_muestras);
              valor = parseFloat(element.cantidad_muestras);
            });          
            // Empujalo al arreglo de objectos para la nueva base de datos
            arregloObjectos.push(Object.create(
              {
                group: keyEstado[i],
                abreviatura: this.keyAbreviatura[i],
                variable: this.keyTipoVariante[j],
                variable_completa: this.completo[j],
                value: valor,
              },
            ));
          }
        }
        // Imprime datos que se muestran en el heatmap
        // console.log('arregloObjectos', arregloObjectos);
        // Asignalos a la data
        this.datas = arregloObjectos;
      } else {
        // Asignando database
        this.datosJSON = consorcioHeatmap;         
        // console.log('this.datosJSON', this.datosJSON);
        
        // Filtro Tipo de Variante
        const filtroTipoVariante = Object.values(this.datosJSON)
          .filter((d) => d.tipo_variante === tipoVariante);

        // Creando keyArray para estado, variante_oms y abreviatura_ent
        const groupEstado = {};
        Object.values(this.datosJSON).forEach((alumno) => {
          const nombreGrupo = alumno.estado;
          if (!groupEstado[nombreGrupo]) groupEstado[nombreGrupo] = [];
          groupEstado[nombreGrupo].push(alumno);
        });
        const keyEstado = Object.keys(groupEstado);
        // console.log("keyEstado",keyEstado);
        const groupVarianteOMS = {};
        Object.values(filtroTipoVariante).forEach((alumno) => {
          const nombreGrupo = alumno.variante_oms;
          if (!groupVarianteOMS[nombreGrupo]) groupVarianteOMS[nombreGrupo] = [];
          groupVarianteOMS[nombreGrupo].push(alumno);
        });
        if (tipoVariante === 'VSIN') {
          // Variantes sin clasificación // <-- PEDIR AL STORE EL TOP 5
          // this.keyVarianteOMS = ['B.1.551'];
          this.keyVarianteOMS = ['B.1', 'B.1.243', 'B.1.1', 'B.1.609', 'P.4'];
        } else {
          this.keyVarianteOMS = Object.keys(groupVarianteOMS);
        }
        this.keyVariante = this.keyVarianteOMS;
        // console.log("keyVarianteOMS",this.keyVarianteOMS);
        const groupAbreviaturaEnt = {};
        Object.values(this.datosJSON).forEach((alumno) => {
          const nombreGrupo = alumno.abreviatura_ent;
          if (!groupAbreviaturaEnt[nombreGrupo]) groupAbreviaturaEnt[nombreGrupo] = [];
          groupAbreviaturaEnt[nombreGrupo].push(alumno);
        });
        this.keyAbreviatura = Object.keys(groupAbreviaturaEnt);
        // console.log("keyAbreviatura",this.keyAbreviatura);

        // Creando un nuevo arreglo de objectos con las claves ya filtradas y sumadas
        const arregloObjectos = [];
        for (let i = 0; i < keyEstado.length; i++) {
          // Recorre por el número de estados y asigna el conjunto filtrado
          const filtroEstado = filtroTipoVariante
            .filter((d) => d.estado === keyEstado[i]);
          
          for (let j = 0; j < this.keyVariante.length; j++) {
            // Recorre por el número de variantes_oms asignando el conjunto filtrado
            // y recorre el conjunto para regresar la cantidad de muestras
            
            // Esto es lo que se tiene que implementar en el otro VTODAS
            const valor = filtroEstado
              .filter((d) => d.variante_oms === this.keyVariante[j])
              .map((d) => d.cantidad_muestras);            
            const abr = filtroEstado.map((d) => d.abreviatura_ent);

            // Empujalo al arreglo de objectos para la nueva base de datos
            arregloObjectos.push(Object.create(
              {
                group: keyEstado[i],
                abreviatura: abr[0],
                variante: tipoVariante,
                variable: this.keyVariante[j],
                // value: valor.length === 0 ? 0 : valor[0],
                value: valor,
              },
            ));
          }
        }
        // Imprime datos que se muestran en el heatmap
        // console.log('arregloObjectos', arregloObjectos);
        // Asignalos a la data
        this.datas = arregloObjectos;
      }
    },
    configurandoDimensionesParaHeatmap() {
      /**
       * Método para configurar dimensiones para heatmap
       * en desktop y mobile
      */
      if (window.innerWidth >= this.width_limit) { // 769
        // Desktop
        // Build X, Y scales:
        this.x = d3.scaleBand()
          .range([50, this.width])
          .domain(this.keyAbreviatura)
          .padding(0.03);
        this.y = d3.scaleBand()
          .range([this.height, 0])
          .domain(this.keyVariante)
          .padding(0.03);

        if (this.varianteSeleccionada === 'VTODAS'){
          // Despliega el nombre de las variables completas
          this.y_1 = d3.scaleBand()
            .range([this.height, 0])
            .domain(this.completo)
            .padding(0.03);
          // Despliega el nombre de las variables entre paréntesis
          this.y_1_p = d3.scaleBand()
            .range([this.height, 0])
            .domain(this.parentesis)
            .padding(0.03);
        } 
        // Build X, Y axis:
        this.eje_x_bottom
          .attr('transform', `translate(33, ${this.height + 20} )`)
          .call(d3.axisBottom(this.x).tickSize(0))
          // .style('font-family', 'Montserrat')
          .selectAll('text')
          .style('text-anchor', 'end')
          .style('font-size', '10px')
          .attr('transform', 'rotate(-90)');
        this.eje_x_bottom.select('.domain')
          .remove();

        if (this.varianteSeleccionada === 'VTODAS'){
          this.eje_y
            .call(d3.axisLeft(this.y_1).tickSize(0))
            // .style('font-family', 'Montserrat')
            .attr('transform', 'translate(5, 5)')
            .selectAll('text')
            .style('text-anchor', 'start')
            .style('font-size', '10px')
          this.eje_y.select('.domain')
            .remove();
            this.eje_y_abr.style('opacity', '1');
          this.eje_y_abr
            .call(d3.axisLeft(this.y_1_p).tickSize(0))
       s     // .style('font-family', 'Montserrat')
            .attr('transform', 'translate(5, 20)')
            .selectAll('text')
            .style('text-anchor', 'start')
            .style('font-size', '10px')
          this.eje_y_abr.select('.domain')
            .remove();
        } else {
          this.eje_y
            .call(d3.axisLeft(this.y).tickSize(0))
            // .style('font-family', 'Montserrat')
            .attr('transform', 'translate(5, 5)')
            .selectAll('text')
            .style('text-anchor', 'start')
            .style('font-size', '10px')
          this.eje_y.select('.domain')
            .remove();
        }
      } else {
        // Mobile
        // Build X, Y scales:
        this.x = d3.scaleBand()
          .range([0, this.width])
          .domain(this.keyVariante)
          .padding(0.03);
        this.y = d3.scaleBand()
          .range([0, this.height])
          .domain(this.keyAbreviatura)
          .padding(0.05);

        // Build X, Y axis:
        this.eje_x_top
          .attr('transform', 'translate(40, 5)')
          .call(d3.axisBottom(this.x).tickSize(0))
          // .style('font-family', 'Montserrat')
          .selectAll('text')
          .style('text-anchor', 'middle')
          .style('font-size', '10px');
        this.eje_x_top.select('.domain')
          .remove();
        this.eje_x_bottom
          .attr('transform', `translate(40, ${this.height + 30})`)
          .call(d3.axisBottom(this.x).tickSize(0))
          // .style('font-family', 'Montserrat')
          .selectAll('text')
          .style('text-anchor', 'middle')
          .style('font-size', '10px');
        this.eje_x_bottom.select('.domain')
          .remove();
        this.eje_y
          .call(d3.axisLeft(this.y).tickSize(0))
          // .style('font-family', 'Montserrat')
          .style('text-anchor', 'start')
          .attr('transform', 'translate(10, 25)');
        this.eje_y.select('.domain')
          .remove();
      }
    },
    creandoHeatmapDesktop() {
      /** */
      // Build color scale
      const escalaColor = this.variables_grafica.map((d) => d.color);
      const catChecked = this.categorias_checkeadas;

      // remove all rects created
      this.grupo_contenedor
        .selectAll('rect.rects-heatmaps')
        .remove();

      // Join rects with color values
      this.heatmap = this.grupo_contenedor.selectAll('grects')
        .data(this.datas, function (d) { return d.abreviatura + ':' + d.variable; })
        .join('rect')
        .attr('class', (d) => `${d.abreviatura} rects-heatmaps`)
        .attr('width', this.x.bandwidth())
        .attr('height', this.y.bandwidth())
        .style('fill', function (d) {
          if (d.value == 0) {
            return (catChecked.filter((dd) => dd === 'Rango_0') == 'Rango_0')
              ? escalaColor[0] : 'transparent';
          }
          if (d.value > 0 && d.value < 20) {
            return (catChecked.filter((dd) => dd === 'Rango_1') == 'Rango_1')
              ? escalaColor[1] : 'transparent';
          }
          if (d.value >= 20 && d.value < 40) {
            return (catChecked.filter((dd) => dd === 'Rango_2') == 'Rango_2')
              ? escalaColor[2] : 'transparent';
          }
          if (d.value >= 40 && d.value < 60) {
            return (catChecked.filter((dd) => dd === 'Rango_3') == 'Rango_3')
              ? escalaColor[3] : 'transparent';
          }
          if (d.value >= 60 && d.value < 80) {
            return (catChecked.filter((dd) => dd === 'Rango_4') == 'Rango_4')
              ? escalaColor[4] : 'transparent';
          } else {
            return (catChecked.filter((dd) => dd === 'Rango_5') == 'Rango_5')
              ? escalaColor[5] : 'transparent';
          }
        })
        .on('mousemove', (evento, datum) => {
          this.mostrarTooltip(evento, datum);
        })
        .on('mouseout', () => {
          this.cerrarTooltip;
        });
    },
    creandoHeatmapMobile() {
      /**
       * Método para crear el heatmap versión movil
      */
      // Build color scale
      const escalaColor = this.variables_grafica.map((d) => d.color);
      const catChecked = this.categorias_checkeadas;

      // remove all rects created
      this.grupo_contenedor
        .selectAll('rect.rects-heatmaps')
        .remove();

      // Join rects with color values
      this.heatmap = this.grupo_contenedor.selectAll('grects')
        .data(this.datas, function (d) { return d.abreviatura + ':' + d.variable; })
        .join('rect')
        .attr('class', (d) => `${d.abreviatura} rects-heatmaps`)
        .attr('width', this.x.bandwidth())
        .attr('height', this.y.bandwidth())
        // .style("fill", function(d) { return myColor(d.value)} )
        .style('fill', function (d) {
          if (d.value == 0) {
            if (catChecked.filter((dd) => dd === 'Rango_0') == 'Rango_0') {
              return escalaColor[0];
            } else {
              return 'transparent';
            }
          }
          if (d.value >= 0 && d.value < 20) {
            if (catChecked.filter((dd) => dd === 'Rango_1') == 'Rango_1') {
              return escalaColor[1];
            } else {
              return 'transparent';
            }
          }
          if (d.value >= 20 && d.value < 40) {
            if (catChecked.filter((dd) => dd === 'Rango_2') == 'Rango_2') {
              return escalaColor[2];
            } else {
              return 'transparent';
            }
          }
          if (d.value >= 40 && d.value < 60) {
            if (catChecked.filter((dd) => dd === 'Rango_3') == 'Rango_3') {
              return escalaColor[3];
            } else {
              return 'transparent';
            }
          }
          if (d.value >= 60 && d.value < 80) {
            if (catChecked.filter((dd) => dd === 'Rango_4') == 'Rango_4') {
              return escalaColor[4];
            } else {
              return 'transparent';
            }
          }
          if (catChecked.filter((dd) => dd === 'Rango_5') == 'Rango_5') {
            return escalaColor[5];
          } else {
            return 'transparent';
          }
        })
        .attr('transform', 'translate(0, 15)')
        .on('mousemove', (evento, datum) => {
          this.mostrarTooltip(evento, datum);
        });
    },
    actualizandoHeatmap() {
      /**
       * Método para actualizar vectores trazados del heatmap
      */
      this.heatmap
        .data(this.datas, function (d) { return d.abreviatura + ':' + d.variable; })
        .attr('x', (d) => window.innerWidth >= this.width_limit
          ? this.x(d.abreviatura) : this.x(d.variable))
        .attr('y', (d) => window.innerWidth >= this.width_limit
          ? this.y(d.variable) : this.y(d.abreviatura));
    },
    mostrarTooltip(evento, datum) {
      /**
       * Método para desplegar el tooltip
       */
      d3.select(this.$refs.tooltip)
        .style('visibility', 'visible')
        .style('left', `${evento.pageX + 5}px`)
        .style('top', `${evento.pageY + 5}px`);
      d3.select(this.$refs.tooltip_grupo)
        .text(datum.group);
      d3.select(this.$refs.tooltip_variable)
        .text(datum.group);
      if (this.varianteSeleccionada === 'VTODAS'){
        d3.select(this.$refs.tooltip_cifra)
          .html(`${datum.variable_completa} (${datum.variable}) | <b>${datum.value}</b>`);
      } else {
        d3.select(this.$refs.tooltip_cifra)
          .html(`${datum.variable} | <b>${datum.value}</b>`);
      }
      // d3.select(this.$refs.tooltip_cifra)
      //   .html(`${datum.variable_completa} (${datum.variable}ho) | <b>${datum.value}</b>`);
      // .html(`${this.variables
      // .filter((d) => d.id === datum.data.key)[0].nombre} | <b>${datum.data[this.variables
      // .filter((d) => d.id === datum.data.key)[0].id].toLocaleString('en')}<b>`)
      // console.log('datum',datum.group);
      // console.log('evento',evento);
    },
    cerrarTooltip() {
      /**
       * Método para esconder el tooltip
       */
      d3.select(this.$refs.tooltip)
        .style('visibility', 'hidden')
        .style('left', '0')
        .style('top', '0');
    },
    quitaPon() {
      if (!this.lista_filtros_activos.includes(false)) {
        this.status_button = 'Poner todos';
        this.lista_filtros_activos = this.lista_filtros_activos.map(() => false);
      } else {
        this.status_button = 'Quitar todos';
        this.lista_filtros_activos = this.lista_filtros_activos.map(() => true);
      }
    },
  },
};
</script>

<style scoped lang="scss">

$border-radius-tarjeta: 10px;

.nomenclatura{
    border-radius: $border-radius-tarjeta;
    // box-shadow: 0px -5px 5px -1px rgb(221, 221, 221);
    div.leyenda-mapa-calor{
      width: 100%;
      display: flex;
      p.titulo-leyenda{
        // text-align: center;
        text-align: left;
        font-size: 12px;
        font-weight: 700;
        flex: auto;
        margin-left: 10px;
      }
      button.quita-pon{
        position: relative;
        right: 0px;
        margin:5px 10px 5px auto;
        font-size: 12px;
        padding: 0 10px;
        color: #000;
        border: 1px solid #000000;
        border-radius: 5px;
        background: #fff;
        @media (max-width: 1025px) {
          display:none;
        }
      }
    }
    div.checks{
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      margin-bottom:10px;
      div{
        margin-top: 10px;
        width: 50%;
        // -ms-flex: 0 0 50%;
        // flex: 0 0 50%;
        -ms-flex: 0 0 33%;
        flex: 0 0 33%;
        @media (min-width: 769px) {
          width: 20%;
          // -ms-flex: 0 0 16%;
          // flex: 0 0 16%;
          -ms-flex: 0 0 28%;
          flex: 0 0 28%;
        }
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
  }
.mapa-calor{
  display: grid;
  grid-gap: 10px;
  grid-template-areas:
    "titulo"
    "nomenclatura"
    "mapa";
  @media (min-width: 769px) {
    grid-template-areas:
    "titulo mapa"
    "nomenclatura mapa";
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 1fr 2fr;
  }
}
.titulo-calor{
  grid-area: titulo;
  @media (min-width: 769px) {
    // background-color: goldenrod;
    border-bottom: 1px solid #ccc;
  }
}
.nomenclatura{
  grid-area: nomenclatura;
}
.contenedor-vis{
  grid-area: mapa;
}
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
</style>
