import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { VueQueryPlugin } from '@tanstack/vue-query'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { FaTimes, FaPlus, FaPause, FaStop } from 'oh-vue-icons/icons/fa'

addIcons(FaTimes, FaPlus, FaPause, FaStop)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)
app.component('v-icon', OhVueIcon)

app.mount('#app')
