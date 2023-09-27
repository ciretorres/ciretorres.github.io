import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter);

const routes = [
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
  // {
  //   path: '/',
  //   name: 'Inicio',
  //   component: Inicio,
  // },
  // {
  //   path: '/design',
  //   name: 'Design',
  //   component: () => import('@/views/Design.vue'),
  // },
  // {
  //   path: '/pruebas',
  //   name: 'Pruebas',
  //   component: () => import('@/views/pruebas/Pruebas.vue'),
  // },
  // {
  //   path: '/design/visualization',
  //   name: 'Visualization',
  //   component: () => import('@/views/design/Visualization.vue'),
  //   children: [
  //     {
  //       path: '/design/visualization/d3js',
  //       name: 'D3JS',
  //       component: () => import('@/views/design/D3JS.vue'),
  //     },
  //     {
  //       path: '/design/visualization/maps',
  //       name: 'Maps',
  //       component: () => import('@/views/design/Maps.vue'),
  //     },
  //     {
  //       path: '/design/visualization/gravity-apple-tree',
  //       name: 'Maps',
  //       component: () => import('@/components/visualizations/gravity-apple-tree/GravityAppleTree.vue'),
  //     },
  //   ]
  // },
  // {
  //   path: '/development',
  //   name: 'Development',
  //   component: () => import('@/views/Development.vue'),
  //   children: [
  //     // {
  //     //   path: '/luxyji',
  //     //   name: 'LuxuryJewelryImports',
  //     //   component: () => import('@/views/development/LuxuryJewelryImports.vue'),
  //     // },
  //   ]
  // },
  // {
  //   path: '/marketing-design/luxji',
  //   name: 'LuxuryJewelryImports',
  //   component: () => import('@/views/marketing-design/LuxuryJewelryImports.vue'),
  // },
  // {
  //   path: '/marketing-design/centro-optico-profesional',
  //   name: 'CentroOpticoProfesional',
  //   component: () => import('@/views/marketing-design/CentroOpticoProfesional.vue'),
  // },
  // {
  //   path: '/marketing-design/expediciones-trotamundos',
  //   name: 'ExpedicionesTrotamundos',
  //   component: () => import('@/views/marketing-design/ExpedicionesTrotamundos.vue'),
  // },
  // {
  //   path: '/marketing-design/tulumers',
  //   name: 'Tulumers',
  //   component: () => import('@/views/marketing-design/Tulumers.vue'),
  // },
  // // {
  // //   path: '/marketing',
  // //   name: 'Marketing',
  // //   component: () => import('@/views/Marketing.vue'),
  // // },
  // {
  //   path: '/marketing-design/oxxo',
  //   name: 'Oxxo',
  //   component: () => import('@/views/marketing-design/Oxxo.vue'),
  // },
  // {
  //   path: '/marketing-design/cem',
  //   name: 'CircuitoExteriorMexiquense',
  //   component: () => import('@/views/marketing-design/CircuitoExteriorMexiquense.vue'),
  // },
  // {
  //   path: '/marketing-design/bibiki',
  //   name: 'Bibiki',
  //   component: () => import('@/views/marketing-design/Bibiki.vue'),
  // },
  // {
  //   path: '/marketing-design/loreto-fish',
  //   name: 'LoretoFish',
  //   component: () => import('@/views/marketing-design/LoretoFish.vue'),
  // },
  // // {
  // //   path: '/ayuda',
  // //   name: 'Ayuda',
  // //   component: () => import('@/views/Ayuda.vue'),
  // // },  
  // // {
  // //   path: '**',
  // //   name: 'Página no encontrada',
  // //   component: () => import('@/views/404.vue'),
  // // },
];

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
          y: 80
        }
      }
    } else {
      return { x: 0, y: 0, behavior: 'smooth' }
    }
  },
});

// Muestra el título de la página dependiendo de las vistas
router.beforeEach((to, from, next) => {
  document.title = `ciretorres | ${to.name}`
  next()
})

export default router;
