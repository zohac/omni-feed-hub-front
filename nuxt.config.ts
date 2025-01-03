// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE ?? 'http://localhost:3000/api',
    }
  },
  ssr: false,
  server: {
    port: process.env.PORT ?? 3000, // Par défaut 4000 si aucune variable n'est définie
    host: process.env.HOST ?? '0.0.0.0'  // Permet d'écouter sur toutes les interfaces réseau
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxtjs/color-mode'],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '-mode',
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode'
  }
})