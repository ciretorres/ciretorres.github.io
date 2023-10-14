import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: HomeView,
  },
  {
    path: '/pruebas',
    name: 'Pruebas',
    component: () => import('@/views/pruebas/PruebasView.vue'),
  },

  /**
   * visualization
   */
  {
    path: '/development/visualization',
    name: 'Visualization',
    component: () => import('@/views/development/VisualizationPage.vue'),
    children: [
      {
        path: '/development/visualization/intro',
        name: 'Introduction Visualization',
        component: () => import('@/views/development/IntroductionPage.vue'),
      },
      {
        path: '/development/visualization/d3js',
        name: 'D3.js',
        component: () => import('@/views/development/D3JS.vue'),
      },
      {
        path: '/development/visualization/multiline',
        name: 'Multilinea',
        component: () => import('@/views/development/MultilineView.vue'),
      },
      {
        path: '/development/visualization/area',
        name: 'Área',
        component: () => import('@/views/development/AreaView.vue'),
      },
      {
        path: '/development/visualization/sankey',
        name: 'Diagrama de flujo',
        component: () => import('@/views/development/SankeyView.vue'),
      },
      {
        path: '/development/visualization/maps',
        name: 'Mapas',
        component: () => import('@/views/development/MapsPage.vue'),
      },
      {
        path: '/development/visualization/gravity-apple-tree',
        name: 'Gravity Apple Tree',
        component: () =>
          import(
            '@/components/visualizations/gravity-apple-tree/GravityAppleTree.vue'
          ),
      },
    ],
  },
  /**
   * development
   */
  {
    path: '/development',
    name: 'Desarrollo',
    component: () => import('@/views/DevelopmentView.vue'),
  },
  {
    path: '/design',
    name: 'Comunicación y Diseño',
    component: () => import('@/views/DesignView.vue'),
  },
  {
    path: '/design/centro-optico-profesional',
    name: 'Centro Óptico Profesional',
    component: () => import('@/views/design/CentroOpticoProfesional.vue'),
  },
  {
    path: '/design/expediciones-trotamundos',
    name: 'Expediciones Trotamundos',
    component: () => import('@/views/design/ExpedicionesTrotamundos.vue'),
  },
  {
    path: '/design/tulumers',
    name: 'Tulumers',
    component: () => import('@/views/design/TulumersPage.vue'),
  },
  {
    path: '/design/luxji',
    name: 'Luxury Jewelry Imports',
    component: () => import('@/views/design/LuxuryJewelryImports.vue'),
  },
  {
    path: '/design/oxxo',
    name: 'OXXO',
    component: () => import('@/views/design/OxxoPage.vue'),
  },
  {
    path: '/design/circuito-exterior-mexiquense',
    name: 'Circuito Exterior Mexiquense',
    component: () => import('@/views/design/CircuitoExteriorMexiquense.vue'),
  },
  {
    path: '/design/bibiki',
    name: 'Bibiki',
    component: () => import('@/views/design/BibikiPage.vue'),
  },
  {
    path: '/design/loreto-fish',
    name: 'Loreto Fish',
    component: () => import('@/views/design/LoretoFish.vue'),
  },
  {
    path: '/**',
    name: 'Página no encontrada',
    component: () => import('@/views/ErrorViewNotFound.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
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
  document.title = `ciretorres | ${to.name}`
  next()
})

export default router
