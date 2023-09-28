import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Biblioteca de mapas
import DaiMaps from "dai-maps"
import "dai-maps/dist/dai-maps.css"
Vue.use(DaiMaps)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
