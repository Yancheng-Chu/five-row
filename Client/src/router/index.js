import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('../components/main.vue')
  },
  {
    path: '/online/:room',
    name:'online',
    component: () => import('../components/online.vue')
  },
  {
    path: '/local',
    component: () => import('../components/local.vue')
  },
  {
    path: '/test',
    component: () => import('../components/test.vue')
  }
];


const router = createRouter({
  history: createWebHashHistory(),  // hash路由模式
//   history: createWebHistory(),  // history路由模式
  routes
});

export default router;
