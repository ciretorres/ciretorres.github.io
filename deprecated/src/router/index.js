import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Inicio',
      component: HomeView
    },
    // visualization
    {
      path: '/development/visualization',
      name: 'Visualization',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/development/VisualizationPage.vue'),
      children: [
        {
          path: '/development/visualization/d3js',
          name: 'D3JS',
          component: () => import('@/views/development/D3JS.vue')
        },
        {
          path: '/development/visualization/maps',
          name: 'Maps',
          component: () => import('@/views/development/MapsPage.vue')
        }
        // {
        //   path: '/design/visualization/gravity-apple-tree',
        //   name: 'Maps',
        //   component: () => import('@/components/visualizations/gravity-apple-tree/GravityAppleTree.vue'),
        // },
      ]
    },
    // development
    {
      path: '/development',
      name: 'Desarrollo',
      component: () => import('@/views/DevelopmentView.vue')
    },
    {
      path: '/design',
      name: 'Comunicación y Diseño',
      component: () => import('@/views/DesignView.vue')
    },
    {
      path: '/design/centro-optico-profesional',
      name: 'Centro Óptico Profesional',
      component: () => import('@/views/design/CentroOpticoProfesional.vue')
    },
    {
      path: '/design/expediciones-trotamundos',
      name: 'Expediciones Trotamundos',
      component: () => import('@/views/design/ExpedicionesTrotamundos.vue')
    },
    {
      path: '/design/tulumers',
      name: 'Tulumers',
      component: () => import('@/views/design/TulumersPage.vue')
    },
    {
      path: '/design/luxji',
      name: 'Luxury Jewelry Imports',
      component: () => import('@/views/design/LuxuryJewelryImports.vue')
    },
    {
      path: '/design/oxxo',
      name: 'OXXO',
      component: () => import('@/views/design/OxxoPage.vue')
    },
    {
      path: '/design/circuito-exterior-mexiquense',
      name: 'Circuito Exterior Mexiquense',
      component: () => import('@/views/design/CircuitoExteriorMexiquense.vue')
    },
    {
      path: '/design/bibiki',
      name: 'Bibiki',
      component: () => import('@/views/design/BibikiPage.vue')
    },
    {
      path: '/design/loreto-fish',
      name: 'Loreto Fish',
      component: () => import('@/views/design/LoretoFish.vue')
    },
    {
      path: '/**',
      name: 'pagina-no-encontrada',
      component: () => import('@/views/ErrorViewNotFound.vue')
    }
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        selector: to.hash,
        offset: {
          x: 0,
          y: 80
        }
      }
    } else {
      return { x: 0, y: 0, behavior: 'smooth' }
    }
  }
})

// Muestra el título de la página dependiendo de las vistas
router.beforeEach((to, from, next) => {
  document.title = `ciretorres | ${to.name}`
  next()
})

export default router
