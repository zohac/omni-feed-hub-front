<template>
  <v-row>
    <v-col>
      <h1>Gestion des Flux RSS</h1>
    </v-col>

    <v-col class="d-flex justify-end align-center">
      <v-btn color="primary" text="Ajouter un Flux Rss" @click="newFeed" />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="feedStore.feeds"
        class="elevation-1"
        item-value="id"
        @update:options="feedStore.fetchFeeds()"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            v-tooltip:top="'Modifier'"
            class="me-2"
            color="primary"
            density="comfortable"
            icon="mdi-pencil"
            @click="updateFeed(item)"
          />

          <v-btn
            v-tooltip:top="'Supprimer'"
            color="error"
            density="comfortable"
            icon="mdi-delete"
            @click="deleteFeed(item)"
          />
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <!-- Formulaire de création -->
  <v-dialog v-model="isOpen" class="d-flex align-center justify-center" max-width="500">
    <FeedForm :form-data="form" :is-new-feed="isNewFeed" @form-submit="submitForm" />
  </v-dialog>

  <!-- Snackbar pour les Messages Flash -->
  <CoreAppSnackbar v-model="snackbar.show" :color="snackbar.color" :message="snackbar.message" />
</template>

<script lang="ts" setup>
import FeedForm from '~/components/feeds/FeedForm.vue'
import { useFeedStore } from '~/stores/feedStore'
import type { CreateRssFeedDto, UpdateRssFeedDto } from '~/types/dtos/RssFeedDto'
import type { RssFeed } from '~/types/entities/RssFeed'

const feedStore = useFeedStore()
const isOpen = ref(false)
const isNewFeed = ref(false)
const headers = [
  { title: 'Titre', align: 'start', key: 'title' },
  { title: 'URL', align: 'start', key: 'url' },
  { title: 'Description', align: 'start', key: 'description' },
  { title: 'Actions', align: 'start', key: 'actions', sortable: false }
]

// Snackbar pour les notifications
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

// Créer ou mettre à jour un flux
const submitForm = async (values: CreateRssFeedDto | UpdateRssFeedDto) => {
  let response
  if (isNewFeed.value) {
    response = await feedStore.createFeed(values as CreateRssFeedDto)
  } else if (isUpdateDto(values)) {
    const { id, ...dto } = values
    response = await feedStore.updateFeed(id!, dto)
  } else {
    console.error('Le DTO pour la mise à jour est invalide.')
    return
  }

  for (const message of response.message) {
    showSnackbar(message, response.success ? 'success' : 'error')
  }
  if (response.success) closeModal()
}

// Type guard pour vérifier si l'objet est UpdateRssFeedDto
function isUpdateDto(dto: CreateRssFeedDto | UpdateRssFeedDto): dto is UpdateRssFeedDto {
  return 'id' in dto
}

// Supprimer un flux
const deleteFeed = async (feed: RssFeed) => {
  if (confirm('Voulez-vous vraiment supprimer ce flux ?')) {
    const response = await feedStore.deleteFeed(feed.id)
    showSnackbar(response.message, response.success ? 'success' : 'error')
  }
}

// Préparer la modification (fonction à compléter)
const updateFeed = (rssFeed: RssFeed) => {
  const feed = feedStore.feeds.find((feed) => feed.id === rssFeed.id)
  form.value = { ...feed }
  isOpen.value = true
  isNewFeed.value = false
}

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

// Afficher les messages flash
const showSnackbar = (message: string, color: 'success' | 'error') => {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.show = true
}

// Fermer la modale
const closeModal = () => {
  isOpen.value = false
  form.value = { title: '', url: '', description: '', collectionId: undefined }
}
</script>
