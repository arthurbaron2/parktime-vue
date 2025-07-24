import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShowsView from '../views/ShowsView.vue'
import AttractionsView from '../views/AttractionsView.vue'
import SettingsView from '../views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/shows',
      name: 'shows',
      component: ShowsView,
    },
    {
      path: '/attractions',
      name: 'attractions',
      component: AttractionsView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
  ],
})

export default router
