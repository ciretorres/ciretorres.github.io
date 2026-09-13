import { defineNuxtConfig } from 'nuxt/config'

const site = {
  name: 'ciretorres',
  url: 'https://ciretorres.github.io',
  description:
    'Portafolio de proyectos de desarrollo web con Nuxt, Vue, D3.js, Sass y Sisdai.'
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxt/eslint'],

  ssr: true,

  devtools: {
    enabled: true
  },

  app: {
    baseURL: '/',
    // baseURL: '/nombre-del-repositorio/',

    head: {
      htmlAttrs: {
        lang: 'es-MX'
      },

      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: site.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: site.name },
        { property: 'og:title', content: site.name },
        { property: 'og:description', content: site.description },
        { property: 'og:url', content: site.url },
        { property: 'og:image', content: `${site.url}/img/icono.png` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: site.name },
        { name: 'twitter:description', content: site.description },
        { name: 'twitter:image', content: `${site.url}/img/icono.png` }
      ],

      link: [
        {
          rel: 'icon',
          // type: 'image/svg+xml',
          // type: 'image/png',
          type: 'image/x-icon',
          href: '/favicon.ico'
        },
        {
          rel: 'canonical',
          href: site.url
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous'
        }
      ]
    }
  },

  css: ['~/assets/style/main.scss'],

  routeRules: {
    '/': {
      prerender: true
    },
    '/web-development': {
      prerender: true
    },
    '/visualization': {
      prerender: true
    },
    '/visualization/**': {
      prerender: true
    }
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true
    }
  },

  vite: {
    ssr: {
      noExternal: [
        '@centrogeomx/sisdai-mapas',
        'ol-displaced-points',
        'circle-properties'
      ]
    }
  },

  eslint: {
    config: {
      // se desactiva porque prettier se encarga del formateo
      stylistic: false
      // stylistic: {
      //   commaDangle: 'never',
      //   braceStyle: '1tbs',
      //   semi: false,
      //   quotes: 'single',
      //   indent: 2
      // }
    }
  }
})
