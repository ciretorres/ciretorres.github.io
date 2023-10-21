import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // base: import.meta.env.BASE_URL,
  css: {
    loaderOptions: {
      scss: {
        // additionalData: `@import 'sisdai-css/src/_variables.scss'; @import 'sisdai-css/src/_mixins.scss';`,
      }
    }
  },
  plugins: [
    vue({
      // template: {
      //   compilerOptions: {
      //     isCustomElement: tag => tag.startsWith('dai-'),
      //   },
      // },
    })
  ],
  // define: {
  //   'process.env': process.env
  // },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
