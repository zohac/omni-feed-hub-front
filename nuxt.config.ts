// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify'
import transformAssetUrls = vuetify.transformAssetUrls

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE ?? 'http://localhost:3000/api'
    }
  },
  ssr: false,
  server: {
    port: process.env.PORT ?? 3000, // Par défaut 3000 si aucune variable n'est définie
    host: process.env.HOST ?? '0.0.0.0' // Permet d'écouter sur toutes les interfaces réseau
  },
  css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.css'],
  pinia: {
    storesDirs: ['./stores/**']
  },
  build: {
    transpile: ['vuetify']
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@pinia/nuxt'
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls
      }
    }
  }
})
