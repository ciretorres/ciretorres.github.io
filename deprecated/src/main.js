// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

import DaiMaps from 'dai-maps'
import 'dai-maps/dist/dai-maps.css'
app.use(DaiMaps)
// app.provide('DaiMaps', DaiMaps)
// app.component('DaiMaps', DaiMaps)

app.use(createPinia())
app.use(router)

app.mount('#app')
