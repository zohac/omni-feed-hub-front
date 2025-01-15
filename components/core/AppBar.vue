<template>
  <v-app-bar :elevation="2" color="primary" dark prominent>
    <template #prepend>
      <v-app-bar-nav-icon
        icon="mdi-page-layout-sidebar-left"
        @click="toggleSidebar"
      ></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>Omni Feed Hub</v-app-bar-title>

    <v-row>
      <v-col>
        <!-- Bouton central pour ajouter un flux RSS -->
        <v-btn class="mx-auto" flat prepend-icon="mdi-rss" variant="outlined" @click="newFeed">
          <template v-slot:prepend>
            <v-icon></v-icon>
          </template>
          Ajouter un Flux RSS
        </v-btn>
      </v-col>
    </v-row>

    <template #append>
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in menuItems" :key="index" :to="item.to">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <!-- Formulaire de création (dialogue) -->
    <v-dialog v-model="isOpen" class="d-flex align-center justify-center" max-width="500">
      <FeedsForm :form-data="form" :is-new-feed="isNewFeed" @form-submit="submitForm" />
    </v-dialog>

    <!-- Snackbar pour les messages -->
    <CoreAppSnackbar v-model="snackbar.show" :color="snackbar.color" :message="snackbar.message" />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useSidebar } from '~/composables/useSidebar'
import { useFeedStore } from '~/stores/feedStore'
import type { CreateRssFeedDto } from '~/types/dtos/RssFeedDto'

const { toggleSidebar } = useSidebar()
const feedStore = useFeedStore()

const isOpen = ref(false)
const isNewFeed = ref(false)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const form = ref<CreateRssFeedDto>({
  title: '',
  url: '',
  description: '',
  collectionId: undefined
})

const menuItems = [
  { title: 'Gérer les Feeds', to: '/feeds' },
  { title: 'Gérer les Collections de Feeds', to: '/collections/feeds' },
  { title: "Gérer les Collections d'articles", to: '/collections/articles' },
  { title: 'Gérer les agents', to: '/agents' },
  { title: 'Paramètres', to: '/settings' }
]

// Ouvrir le formulaire de création
const newFeed = () => {
  form.value = {
    title: '',
    url: '',
    description: '',
    collectionId: undefined
  }
  isOpen.value = true
  isNewFeed.value = true
}

// Gérer la soumission du formulaire
// Soumission du formulaire (mise à jour automatique)
const submitForm = async (values: CreateRssFeedDto) => {
  const response = await feedStore.createFeed(values)

  for (const message of response.message) {
    showSnackbar(message, response.success ? 'success' : 'error')
  }

  if (response.success) {
    await feedStore.fetchFeeds() // Mise à jour manuelle après ajout
    isOpen.value = false
    resetForm()
  }
}

// Afficher les notifications
const showSnackbar = (message: string, color: 'success' | 'error') => {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.show = true
}

// Réinitialiser le formulaire
const resetForm = () => {
  form.value = { title: '', url: '', description: '', collectionId: undefined }
}
</script>
