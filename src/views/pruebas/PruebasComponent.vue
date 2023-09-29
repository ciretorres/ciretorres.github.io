<!-- <template>
  <div class="b-pruebas">
    <div id="my_dataviz"></div>
    <Controls :data="data" @remove-edge="removeEdge" v-if="data"/>
    <Sankey :data="data" />
  </div>
</template>

<script>
// import * as d3 from "d3";
import { select } from 'd3-selection'
import { sankey } from 'd3-sankey'
import { sankeyLinkHorizontal } from 'd3-sankey'
// import { linkHorizontal } from "d3";

import Sankey from './components/SankeyComponent.vue'
// import Controls from "./components/Controls.vue";

export default {
  name: 'App',
  // components: { Sankey, Controls },
  components: { Sankey },
  data: () => ({
    data: null,
    datos: null,
    edgeToRemove: null,
  }),
  async mounted() {
    // const response = await fetch(
    //   // "https://raw.githubusercontent.com/ozlongblack/d3/master/energy.json"
    //   // "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_sankey.json"
    // );
    // this.data = {
    //   "nodes": [
    //     { "name": "Agricultural 'waste'" },
    //     { "name": "Bio-conversion" },
    //     { "name": "Liquid" }, { "name": "Losses" }, { "name": "Solid" }, { "name": "Gas" }, { "name": "Biofuel imports" }, { "name": "Biomass imports" }, { "name": "Coal imports" }, { "name": "Coal" }, { "name": "Coal reserves" }, { "name": "District heating" }, { "name": "Industry" }, { "name": "Heating and cooling - commercial" }, { "name": "Heating and cooling - homes" }, { "name": "Electricity grid" }, { "name": "Over generation / exports" }, { "name": "H2 conversion" }, { "name": "Road transport" }, { "name": "Agriculture" }, { "name": "Rail transport" }, { "name": "Lighting & appliances - commercial" }, { "name": "Lighting & appliances - homes" }, { "name": "Gas imports" }, { "name": "Ngas" }, { "name": "Gas reserves" }, { "name": "Thermal generation" }, { "name": "Geothermal" }, { "name": "H2" }, { "name": "Hydro" }, { "name": "International shipping" }, { "name": "Domestic aviation" }, { "name": "International aviation" }, { "name": "National navigation" }, { "name": "Marine algae" }, { "name": "Nuclear" }, { "name": "Oil imports" }, { "name": "Oil" }, { "name": "Oil reserves" }, { "name": "Other waste" }, { "name": "Pumped heat" }, { "name": "Solar PV" }, { "name": "Solar Thermal" }, { "name": "Solar" }, { "name": "Tidal" }, { "name": "UK land based bioenergy" }, { "name": "Wave" }, { "name": "Wind" }
    //   ],
    //   "links": [
    //     { "source": 0, "target": 1, "value": 124.729 },
    //     { "source": 1, "target": 2, "value": 0.597 },
    //     { "source": 1, "target": 3, "value": 26.862 }, { "source": 1, "target": 4, "value": 280.322 }, { "source": 1, "target": 5, "value": 81.144 }, { "source": 6, "target": 2, "value": 35 }, { "source": 7, "target": 4, "value": 35 }, { "source": 8, "target": 9, "value": 11.606 }, { "source": 10, "target": 9, "value": 63.965 }, { "source": 9, "target": 4, "value": 75.571 }, { "source": 11, "target": 12, "value": 10.639 }, { "source": 11, "target": 13, "value": 22.505 }, { "source": 11, "target": 14, "value": 46.184 }, { "source": 15, "target": 16, "value": 104.453 }, { "source": 15, "target": 14, "value": 113.726 }, { "source": 15, "target": 17, "value": 27.14 }, { "source": 15, "target": 12, "value": 342.165 }, { "source": 15, "target": 18, "value": 37.797 }, { "source": 15, "target": 19, "value": 4.412 }, { "source": 15, "target": 13, "value": 40.858 }, { "source": 15, "target": 3, "value": 56.691 }, { "source": 15, "target": 20, "value": 7.863 }, { "source": 15, "target": 21, "value": 90.008 }, { "source": 15, "target": 22, "value": 93.494 }, { "source": 23, "target": 24, "value": 40.719 }, { "source": 25, "target": 24, "value": 82.233 }, { "source": 5, "target": 13, "value": 0.129 }, { "source": 5, "target": 3, "value": 1.401 }, { "source": 5, "target": 26, "value": 151.891 }, { "source": 5, "target": 19, "value": 2.096 }, { "source": 5, "target": 12, "value": 48.58 }, { "source": 27, "target": 15, "value": 7.013 }, { "source": 17, "target": 28, "value": 20.897 }, { "source": 17, "target": 3, "value": 6.242 }, { "source": 28, "target": 18, "value": 20.897 }, { "source": 29, "target": 15, "value": 6.995 }, { "source": 2, "target": 12, "value": 121.066 }, { "source": 2, "target": 29, "value": 128.69 }, { "source": 2, "target": 18, "value": 135.835 }, { "source": 2, "target": 31, "value": 14.458 }, { "source": 2, "target": 32, "value": 206.267 }, { "source": 2, "target": 19, "value": 3.64 }, { "source": 2, "target": 33, "value": 33.218 }, { "source": 2, "target": 20, "value": 4.413 }, { "source": 34, "target": 1, "value": 4.375 }, { "source": 24, "target": 5, "value": 122.952 }, { "source": 35, "target": 26, "value": 839.978 }, { "source": 36, "target": 37, "value": 504.287 }, { "source": 38, "target": 37, "value": 107.703 }, { "source": 37, "target": 2, "value": 611.99 }, { "source": 39, "target": 4, "value": 56.587 }, { "source": 39, "target": 1, "value": 77.81 }, { "source": 40, "target": 14, "value": 193.026 }, { "source": 40, "target": 13, "value": 70.672 }, { "source": 41, "target": 15, "value": 59.901 }, { "source": 42, "target": 14, "value": 19.263 }, { "source": 43, "target": 42, "value": 19.263 }, { "source": 43, "target": 41, "value": 59.901 }, { "source": 4, "target": 19, "value": 0.882 }, { "source": 4, "target": 26, "value": 400.12 }, { "source": 4, "target": 12, "value": 46.477 }, { "source": 26, "target": 15, "value": 525.531 }, { "source": 26, "target": 3, "value": 787.129 }, { "source": 26, "target": 11, "value": 79.329 }, { "source": 44, "target": 15, "value": 9.452 }, { "source": 45, "target": 1, "value": 182.01 }, { "source": 46, "target": 15, "value": 19.013 }, { "source": 47, "target": 15, "value": 289.366 }] };
    // this.data = {
    //   "nodes":[
    //     {"node": 0, "name": "node0"},
    //     {"node": 1, "name": "node1"},
    //     {"node": 2, "name": "node2"},
    //     {"node": 3, "name": "node3"},
    //     {"node": 4, "name": "node4"}
    //   ],
    //   "links":[
    //     {"source": 0, "target": 2, "value": 2},
    //     {"source": 1, "target": 2, "value": 2},
    //     {"source": 1, "target": 3, "value": 2},
    //     {"source": 0, "target": 4, "value": 2},
    //     {"source": 2, "target": 3, "value": 2},
    //     {"source": 2, "target": 4, "value": 2},
    //     {"source": 3, "target": 4, "value": 4}
    //   ]
    // }
    this.data = {
      nodes: [
        { node: 0, name: 'node0' },
        { node: 1, name: 'node1' },
        { node: 2, name: 'node2' },
        { node: 3, name: 'node3' },
        { node: 4, name: 'node4' },
        { node: 5, name: 'node5' },
        { node: 6, name: 'node6' },
        { node: 7, name: 'node7' },
        { node: 8, name: 'node8' },
        { node: 9, name: 'node9' },
        { node: 10, name: 'node10' },
        { node: 11, name: 'node11' },
        { node: 12, name: 'node12' },
        { node: 13, name: 'node13' },
        { node: 14, name: 'node14' },
        { node: 15, name: 'node15' },
        { node: 16, name: 'node16' },
        { node: 17, name: 'node17' },
        { node: 18, name: 'node18' },
        { node: 19, name: 'node19' },
        { node: 20, name: 'node20' },
        { node: 21, name: 'node21' },
        { node: 22, name: 'node22' },
        { node: 23, name: 'node23' },
        { node: 23, name: 'node23' },
        { node: 25, name: 'node25' },
        { node: 26, name: 'node26' },
        { node: 27, name: 'node27' },
        { node: 28, name: 'node28' },
        { node: 29, name: 'node29' },
        { node: 30, name: 'node30' },
        // {"node": 31, "name": "node31"},
        // {"node": 32, "name": "node32"},
        // {"node": 33, "name": "node33"},
        // {"node": 34, "name": "node34"},
        // {"node": 35, "name": "node35"},
        // {"node": 36, "name": "node36"},
      ],
      links: [
        { source: 0, target: 16, value: 0.1 },
        { source: 0, target: 17, value: 0.1 },
        { source: 1, target: 17, value: 0.1 },
        { source: 2, target: 17, value: 0.1 },
        { source: 3, target: 17, value: 0.1 },
        { source: 3, target: 18, value: 0.1 },
        { source: 4, target: 18, value: 0.1 },
        { source: 4, target: 19, value: 0.1 },
        { source: 5, target: 19, value: 0.1 },
        { source: 6, target: 19, value: 0.1 },
        { source: 6, target: 20, value: 0.1 },
        { source: 7, target: 20, value: 0.1 },
        { source: 8, target: 21, value: 0.1 },
        { source: 9, target: 22, value: 0.1 },
        { source: 10, target: 23, value: 0.1 },
        { source: 11, target: 24, value: 0.1 },
        { source: 12, target: 24, value: 0.1 },
        { source: 13, target: 25, value: 0.1 },
        { source: 14, target: 26, value: 0.1 },
        { source: 15, target: 27, value: 0.1 },
        { source: 16, target: 28, value: 0 },
        { source: 17, target: 28, value: 1 },
        { source: 17, target: 29, value: 1 },
        { source: 17, target: 30, value: 1 },
        { source: 18, target: 28, value: 1 },
        { source: 18, target: 29, value: 1 },
        { source: 19, target: 28, value: 1 },
        { source: 19, target: 29, value: 1 },
        { source: 20, target: 28, value: 1 },
        { source: 20, target: 29, value: 1 },
        { source: 21, target: 28, value: 1 },
        { source: 21, target: 29, value: 1 },
        { source: 22, target: 28, value: 1 },
        { source: 22, target: 29, value: 1 },
        { source: 23, target: 28, value: 1 },
        { source: 23, target: 29, value: 1 },
        { source: 24, target: 28, value: 1 },
        { source: 24, target: 29, value: 1 },
        { source: 25, target: 28, value: 1 },
        { source: 25, target: 29, value: 1 },
        { source: 26, target: 28, value: 1 },
        { source: 26, target: 29, value: 1 },
        { source: 27, target: 28, value: 1 },
        { source: 27, target: 29, value: 1 },
      ],
    }

    // this.data = await response.json();
    this.datos = {
      nodes: [{ id: 'Alice' }, { id: 'Bob' }, { id: 'Carol' }],
      links: [
        { source: 0, target: 1 }, // Alice → Bob
        { source: 1, target: 2 }, // Bob → Carol
      ],
    }
  },
  watch: {
    datos: {
      deep: true,
      immediate: true,
      handler(data) {
        if (!data) return
        this.actualizarSankey()
      },
    },
  },
  methods: {
    linksMethod(graph) {
      return graph.links
    },
    actualizarSankey() {
      console.log('comenzamos')
      // append the svg object to the body of the page
      var svg = select('#my_dataviz')
        .append('svg')
        .attr('width', 450)
        .attr('height', 480)
        .style('background', '#fff')
        .append('g')
        // .style("background", "#000")
        .attr('transform', 'translate(0,0)')
      console.log(svg)

      // Color scale used
      var color = [
        '#1f77b4',
        '#aec7e8',
        '#ff7f0e',
        '#ffbb78',
        '#2ca02c',
        '#98df8a',
        '#d62728',
        '#ff9896',
        '#9467bd',
        '#c5b0d5',
        '#8c564b',
        '#c49c94',
        '#e377c2',
        '#f7b6d2',
        '#7f7f7f',
        '#c7c7c7',
        '#bcbd22',
        '#dbdb8d',
        '#17becf',
        '#9edae5',
      ]
      console.log(color)

      var path = sankeyLinkHorizontal()
      console.log('path', path)

      // Set the sankey diagram properties
      this.sankey = sankey()
        .nodeWidth(36)
        .nodePadding(290)
        // .size([450, 480]);
        .extent([
          [0, 0],
          [450, 480],
        ])
      console.log('sankey_vis', this.sankey)

      // Constructs a new Sankey generator with the default settings.
      this.sankey.nodes(this.datos.nodes).links(this.datos.links)
      // .layout(1);
      // console.log('sankey_vis',this.sankey);

      // console.log('this.sankey.link()', sankeyLinkHorizontal()(this.datos.links))
      // // add in the links
      // var link = svg.append("g")
      //   .selectAll(".link")
      //   .data(this.datos.links)
      //   .enter()
      //   // .append("path")
      //   //   .attr("class", "link")
      //     // .attr("d", this.sankey.link )
      //     // .style("stroke-width", function(d) {
      //     //   console.log('d.dy',d.dy);
      //     //   // return Math.max(1, d.dy);
      //     //   return 1;
      //     // })
      //     // .style("stroke-width", 1);
      // console.log('this.sankey.link()', this.linkComputed)
      // console.log('link',link);

      // var node = svg.append("g");
      // console.log('node',node);
    },
    removeEdge(edge) {
      console.log(edge)
    },
  },
  computed: {
    linkComputed() {
      return sankeyLinkHorizontal()
    },
  },
}
</script> -->
