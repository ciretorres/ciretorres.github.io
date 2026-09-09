const title = 'ciretorres'
const description = ''

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/',
    head: {
      link: [
        {
          rel: 'shortcut icon',
          href: '/favicon.ico',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous',
        },
      ],
      meta: [
        { charset: 'UTF-8', },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'keywords', content: '' },
        { name: 'description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description, },
        { property: 'og:image', content: '/img/icono.png', },
        // { name: 'twitter:card', content: 'summary' },
        // { name: 'twitter:title', content: 'ciretorres' },
        // {
        //   name: 'twitter:description',
        //   content: "metaDescription",
        // },
        // {
        //   name: 'twitter:image',
        //   content: '/img/icono_sigic.png',
        // },
      ],
      htmlAttrs: {
        lang: 'es-mx'
      }
    },
  },

  modules: [
    // '@pinia/nuxt',
    '@nuxt/eslint',
    // '@nuxt/test-utils',
    // '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
