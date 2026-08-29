import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router';
import {routes107, nav107} from '@/v107/router';
import {routes108, nav108} from '@/v108/router';

export const routes = [
  {
    path: '/v108',
    name: 'v108',
    meta: {title: 'v1.08'},
    children: routes108,
  },
  {
    path: '/',
    name: 'v107',
    meta: {title: 'v1.07'},
    children: routes107,
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
];

export default createRouter({
  history: import.meta.env.PROD
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory(),
  routes,
});

export const headerNav = {
  v107: nav107,
  v108: nav108,
};
