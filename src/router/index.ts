import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/signin',
    },
    {
      path: '/index',
      name: 'index',
      redirect: '/home',
      component: () => import('../views/index/index.vue'),
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('../views/home/index.vue'),
        },
        {
          path: '/manage',
          name: 'manage',
          component: () => import('../views/manage/index.vue'),
        },
        {
          path: '/creation',
          name: 'creation',
          component: () => import('../views/creation/index.vue'),
        },
        {
          path: '/favorite',
          name: 'favorite',
          component: () => import('../views/favorite/index.vue'),
        },
        {
          path: '/share',
          name: 'share',
          component: () => import('../views/share/index.vue'),
        },
        {
          path: '/inspiration',
          name: 'inspiration',
          component: () => import('../views/inspiration/index.vue'),
        },
        {
          path: '/shop',
          name: 'shop',
          component: () => import('../views/shop/index.vue'),
        },
      ],
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('../views/signin/index.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/signup/index.vue'),
    },
  ],
});

export default router;
