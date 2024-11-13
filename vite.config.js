import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
        // additionalData: `@import 'sisdai-css/src/_variables.scss'; @import 'sisdai-css/src/_mixins.scss';`
      }
    }
    // loaderOptions: {
    //   scss: {
    //     // additionalData: `@import 'sisdai-css/src/_variables.scss'; @import 'sisdai-css/src/_mixins.scss';`,
    //   }
    // }
  }
  // define: {
  //   'process.env': process.env
  // },
})
