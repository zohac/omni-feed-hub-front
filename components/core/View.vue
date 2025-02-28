<template>
  <v-main class="bg-grey-lighten-5" min-height="100vh">
    <NuxtPage />

    <!-- Snackbar pour les Messages Flash -->
    <CoreAppSnackbar v-model="snackbar.show" :color="snackbar.color" :message="snackbar.message" />
  </v-main>
</template>

<script lang="ts" setup>
import { useMainStore } from '~/stores/mainStore'

const mainStore = useMainStore()

// Snackbar pour les notifications
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Afficher les messages flash
const showSnackbar = (message: string, color: 'success' | 'error') => {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.show = true
}

// Mise à jour des données initiales
watch(
  () => mainStore.snackMessage,
  () => {
    if (mainStore.snackMessage) {
      const color = mainStore.snackMessage.success ? 'success' : 'error'
      for (const message of mainStore.snackMessage.message) {
        showSnackbar(message, color)
      }
    }

    mainStore.snackMessage = null
  }
)
</script>
