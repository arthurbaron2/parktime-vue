import { createRouter, createWebHistory } from 'vue-router'
import { validateParkRoute } from '@/utils/router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:id',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      beforeEnter: validateParkRoute,
    },
    {
      path: '/:id/shows',
      name: 'shows',
      component: () => import('../views/ShowsView.vue'),
      beforeEnter: validateParkRoute,
    },
    {
      path: '/:id/attractions',
      name: 'attractions',
      component: () => import('../views/AttractionsView.vue'),
      beforeEnter: validateParkRoute,
    },
    {
      path: '/:id/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      beforeEnter: validateParkRoute,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'park-selector',
      component: () => import('../views/ParkSelectorView.vue'),
    },
  ],
})

export default router
