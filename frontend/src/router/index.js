import { createRouter, createWebHistory } from 'vue-router';
import MainView from '../views/MainView.vue';
import ConverterView from '../views/ConverterView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView,
    },
    {
      path: '/about',
      name: 'about',
      component: ConverterView,
    },
  ],
});

export default router;
