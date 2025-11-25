import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  scrollBehavior(to) {
    if (to.hash) {
      return {
        selector: to.hash,
        behavior: 'smooth',
        // offset: {
        //   x: 0,
        //   y: 80,
        // },
      }
    } else {
      return {
        // x: 0, y: 0,
        top: 0,
        behavior: 'smooth',
      }
    }
  },
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      component: () => import('../views/InicioView.vue'),
    },
    // no borrar
    {
      path: '/pruebas',
      name: 'Pruebas',
      component: () => import('@/views/pruebas/PruebasView.vue'),
    },
    // development
    {
      path: '/web-dev',
      name: 'Web dev |',
      component: () => import('@/views/DesarrolloView.vue'),
    },
    // visualization
    {
      path: '/visualization',
      name: 'Visualization',
      component: () => import('@/views/VisualizacionView.vue'),
      children: [
        {
          path: '/visualization/intro',
          name: 'Introduction | Visualization |',
          component: () => import('@/views/visualization/IntroductionPage.vue'),
        },
        {
          path: '/visualization/d3js',
          name: 'Heatmap | Visualization |',
          component: () => import('@/views/visualization/HeatmapPage.vue'),
        },
        {
          path: '/visualization/multiline',
          name: 'Multilinea | Visualization |',
          component: () => import('@/views/visualization/MultilinePage.vue'),
        },
        {
          path: '/visualization/area',
          name: 'Área | Visualization |',
          component: () => import('@/views/visualization/AreaPage.vue'),
        },
        {
          path: '/visualization/sankey',
          name: 'Diagrama de flujo | Visualization |',
          component: () => import('@/views/visualization/SankeyPage.vue'),
        },
        {
          path: '/visualization/maps',
          name: 'Mapas | Visualization |',
          component: () => import('@/views/visualization/MapsPage.vue'),
        },
        {
          path: '/visualization/thesis-project',
          name: 'Thesis Project | Visualization |',
          component: () =>
            import('@/views/visualization/ThesisProjectPage.vue'),
        },
      ],
    },
    // error
    {
      path: '/**',
      name: 'Página no encontrada',
      component: () => import('@/views/ErrorViewNotFound.vue'),
    },
  ],
})

// Muestra el título de la página dependiendo de las vistas
router.beforeEach((to, from, next) => {
  document.title = `${to.name} ciretorres`
  next()
})

export default router
