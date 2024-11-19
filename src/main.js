// import './assets/main.min.css'

import { createPinia } from 'pinia'
import SisdaiMapas from 'sisdai-mapas'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(SisdaiMapas)

app.mount('#app')
