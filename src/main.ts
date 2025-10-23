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
  FaCog,
  FaHome,
  FaClock,
  FaShieldAlt,
  FaStoreSlash,
  FaDollarSign,
  FaAccessibleIcon,
  FaUserClock,
  FaArrowsAltV,
  FaChild,
  FaLocationArrow,
  FaMapMarkerAlt,
  FaBolt,
  FaExternalLinkAlt,
  FaLink,
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
  FaCog,
  FaHome,
  FaClock,
  FaUserClock,
  FaShieldAlt,
  FaStoreSlash,
  FaDollarSign,
  FaAccessibleIcon,
  FaArrowsAltV,
  FaChild,
  FaLocationArrow,
  FaMapMarkerAlt,
  FaBolt,
  FaExternalLinkAlt,
  FaLink,
)

import '../src/registerServiceWorker'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)
app.component('v-icon', OhVueIcon)

// Charger Vueform de manière asynchrone
async function loadVueform() {
  const { default: Vueform } = await import('@vueform/vueform')
  const vueformConfig = await import('./../vueform.config')
  app.use(Vueform, vueformConfig.default)
}

// Charger Vueform après le montage de l'app
loadVueform()

app.mount('#app')
