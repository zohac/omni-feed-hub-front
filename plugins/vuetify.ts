// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import { VCalendar } from 'vuetify/labs/components'

const myCustomLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    // BaseColors
    background: '#FAFAFA',
    surface: '#FFFFFF',
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    success: '#4CAF50',
    warning: '#FB8C00',
    error: '#B00020',
    info: '#2196F3',

    // OnColors
    'on-background': '#212529', // Couleur du texte sur background
    'on-surface': '#212529', // Couleur du texte sur surface
    'on-primary': '#FFFFFF', // Couleur du texte sur primary
    'on-secondary': '#FFFFFF', // Couleur du texte sur secondary
    'on-success': '#FFFFFF', // Couleur du texte sur success
    'on-warning': '#212529', // Sur fond jaune/orange, un texte foncé
    'on-error': '#FFFFFF', // Sur fond rouge, texte blanc
    'on-info': '#FFFFFF' // Sur fond info (bleu), texte blanc
  }
}

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: 'myCustomLightTheme',
      themes: {
        myCustomLightTheme
      }
    },
    icons: {
      defaultSet: 'mdi'
    },
    components: {
      VCalendar
    }
  })
  app.vueApp.use(vuetify)
})
