import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    loaderOptions: {
      scss: {
        // additionalData: `@import 'sisdai-css/src/_variables.scss'; @import 'sisdai-css/src/_mixins.scss';`,
      },
    },
  },
  plugins: [
    vue({
      // template: {
      //   compilerOptions: {
      //     isCustomElement: tag => tag.startsWith('dai-'),
      //   },
      // },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
