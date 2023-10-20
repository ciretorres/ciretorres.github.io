// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import SisdaiMapas from 'sisdai-mapas'

const app = createApp(App)

app.use(SisdaiMapas)
app.use(createPinia())
app.use(router)

app.mount('#app')
