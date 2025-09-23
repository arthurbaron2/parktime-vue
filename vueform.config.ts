import fr from '@vueform/vueform/locales/fr'
import { defineConfig } from '@vueform/vueform'
import vueform from '@vueform/vueform/dist/vueform'

import '@vueform/vueform/dist/vueform.css'

export default defineConfig({
  theme: vueform,
  locales: { fr },
  locale: 'fr',
})
