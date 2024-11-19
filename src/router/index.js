import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      component: () => import('../views/InicioView.vue'),
    },
    // development
    {
      path: '/web-development',
      name: 'Web development |',
      component: () => import('@/views/_DesarrolloView.vue'),
    },
    // no borrar
    {
      path: '/pruebas',
      name: 'Pruebas',
      component: () => import('@/views/pruebas/PruebasView.vue'),
    },
    // visualization
    {
      path: '/visualization',
      name: 'Visualization',
      component: () => import('@/views/_VisualizacionView.vue'),
      children: [
        {
          path: '/visualization/intro',
          name: 'Introduction | Visualization |',
          component: () => import('@/views/visualization/IntroductionPage.vue'),
        },
        {
          path: '/visualization/d3js',
          name: 'Heatmap | Visualization |',
          component: () => import('@/views/visualization/D3JS.vue'),
        },
        {
          path: '/visualization/multiline',
          name: 'Multilinea | Visualization |',
          component: () => import('@/views/visualization/MultilineView.vue'),
        },
        {
          path: '/visualization/area',
          name: 'Área | Visualization |',
          component: () => import('@/views/visualization/AreaView.vue'),
        },
        {
          path: '/visualization/sankey',
          name: 'Diagrama de flujo | Visualization |',
          component: () => import('@/views/visualization/SankeyView.vue'),
        },
        {
          path: '/visualization/maps',
          name: 'Mapas | Visualization |',
          component: () => import('@/views/visualization/MapsPage.vue'),
        },
      ],
    },
    // error
    {
      path: '/**',
      name: 'Página no encontrada',
      component: () => import('@/views/ErrorViewNotFound.vue'),
    },
    // {
    //   path: '/design',
    //   name: 'Comunicación y Diseño',
    //   component: () => import('@/views/DesignView.vue')
    // },
    // {
    //   path: '/design/centro-optico-profesional',
    //   name: 'Centro Óptico Profesional',
    //   component: () => import('@/views/design/CentroOpticoProfesional.vue')
    // },
    // {
    //   path: '/design/expediciones-trotamundos',
    //   name: 'Expediciones Trotamundos',
    //   component: () => import('@/views/design/ExpedicionesTrotamundos.vue')
    // },
    // {
    //   path: '/design/tulumers',
    //   name: 'Tulumers',
    //   component: () => import('@/views/design/TulumersPage.vue')
    // },
    // {
    //   path: '/design/luxji',
    //   name: 'Luxury Jewelry Imports',
    //   component: () => import('@/views/design/LuxuryJewelryImports.vue')
    // },
    // {
    //   path: '/design/oxxo',
    //   name: 'OXXO',
    //   component: () => import('@/views/design/OxxoPage.vue')
    // },
    // {
    //   path: '/design/circuito-exterior-mexiquense',
    //   name: 'Circuito Exterior Mexiquense',
    //   component: () => import('@/views/design/CircuitoExteriorMexiquense.vue')
    // },
    // {
    //   path: '/design/bibiki',
    //   name: 'Bibiki',
    //   component: () => import('@/views/design/BibikiPage.vue')
    // },
    // {
    //   path: '/design/loreto-fish',
    //   name: 'Loreto Fish',
    //   component: () => import('@/views/design/LoretoFish.vue')
    // },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        selector: to.hash,
        offset: {
          x: 0,
          y: 80,
        },
      }
    } else {
      return { x: 0, y: 0, behavior: 'smooth' }
    }
  },
})

// Muestra el título de la página dependiendo de las vistas
router.beforeEach((to, from, next) => {
  document.title = `${to.name} ciretorres`
  next()
})

export default router
