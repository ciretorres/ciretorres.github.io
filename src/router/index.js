import Vue from 'vue';
import VueRouter from 'vue-router';
import Inicio from '@/components/Inicio.vue';

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
    component: () => import('@/components/views/Design.vue'),
  },
  {
    path: '/development',
    name: 'Development',
    component: () => import('@/components/views/Development.vue'),
  },
  {
    path: '/marketing',
    name: 'Marketing',
    component: () => import('@/components/views/Marketing.vue'),
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
