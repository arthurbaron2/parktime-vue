import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { VueQueryPlugin } from '@tanstack/vue-query'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  FaTimes,
  FaPause,
  FaStop,
  FaSortAmountDownAlt,
  FaSortAmountDown,
  FaLongArrowAltUp,
  FaHeart,
} from 'oh-vue-icons/icons/fa'
import { MdAttractions } from 'oh-vue-icons/icons/md'
import { GiPartyHat } from 'oh-vue-icons/icons/gi'

addIcons(
  FaTimes,
  FaPause,
  FaStop,
  FaSortAmountDownAlt,
  FaSortAmountDown,
  FaLongArrowAltUp,
  MdAttractions,
  GiPartyHat,
  FaHeart,
)

import '../src/registerServiceWorker'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)
app.component('v-icon', OhVueIcon)

app.mount('#app')
