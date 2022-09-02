import Vue from 'vue';
import VueRouter from 'vue-router';
import Inicio from '@/views/Inicio.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: Inicio,
  },
  {
    path: '/design',
    name: 'Design',
    component: () => import('@/views/Design.vue'),
  },
  {
    path: '/visualization',
    name: 'Visualization',
    component: () => import('@/views/design/Visualization.vue'),
    children: [
      {
        path: '/visualization/d3js',
        name: 'D3JS',
        component: () => import('@/views/design/D3JS.vue'),
      },
      {
        path: '/visualization/maps',
        name: 'Maps',
        component: () => import('@/views/design/Maps.vue'),
      },
    ]
  },
  {
    path: '/development',
    name: 'Development',
    component: () => import('@/views/Development.vue'),
    children: [
      // {
      //   path: '/luxyji',
      //   name: 'LuxuryJewelryImports',
      //   component: () => import('@/views/development/LuxuryJewelryImports.vue'),
      // },
    ]
  },
  {
    path: '/development/luxji',
    name: 'LuxuryJewelryImports',
    component: () => import('@/views/development/LuxuryJewelryImports.vue'),
  },
  {
    path: '/development/centro-optico-profesional',
    name: 'CentroOpticoProfesional',
    component: () => import('@/views/development/CentroOpticoProfesional.vue'),
  },
  {
    path: '/development/expediciones-trotamundos',
    name: 'ExpedicionesTrotamundos',
    component: () => import('@/views/development/ExpedicionesTrotamundos.vue'),
  },
  {
    path: '/development/tulumers',
    name: 'Tulumers',
    component: () => import('@/views/development/Tulumers.vue'),
  },
  {
    path: '/marketing',
    name: 'Marketing',
    component: () => import('@/views/Marketing.vue'),
  },
  {
    path: '/marketing/oxxo',
    name: 'Oxxo',
    component: () => import('@/views/marketing/Oxxo.vue'),
  },
  {
    path: '/marketing/cem',
    name: 'CircuitoExteriorMexiquense',
    component: () => import('@/views/marketing/CircuitoExteriorMexiquense.vue'),
  },
  {
    path: '/marketing/bibiki',
    name: 'Bibiki',
    component: () => import('@/views/marketing/Bibiki.vue'),
  },
  {
    path: '/marketing/loreto-fish',
    name: 'LoretoFish',
    component: () => import('@/views/marketing/LoretoFish.vue'),
  },
  // {
  //   path: '/ayuda',
  //   name: 'Ayuda',
  //   component: () => import('@/views/Ayuda.vue'),
  // },  
  // {
  //   path: '**',
  //   name: 'Página no encontrada',
  //   component: () => import('@/views/404.vue'),
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0, behavior: 'smooth' };
  },
});

export default router;
