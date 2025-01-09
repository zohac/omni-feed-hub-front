<template>
  <v-row>
    <v-col>
      <h1>Gestion des Collections de Flux RSS</h1>
    </v-col>

    <v-col class="d-flex justify-end align-center">
      <v-btn color="primary" text="Ajouter une Collection de Flux Rss" @click="newFeedCollection" />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="feedCollectionStore.feedsCollection"
        class="elevation-1"
        item-value="id"
        @update:options="feedCollectionStore.fetchFeedsCollection()"
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
    <CollectionsFeedsForm
      :form-data="form"
      :is-new-feed-collection="isNewFeedCollection"
      @form-submit="submitForm"
    />
  </v-dialog>

  <!-- Snackbar pour les Messages Flash -->
  <CoreAppSnackbar v-model="snackbar.show" :color="snackbar.color" :message="snackbar.message" />
</template>

<script lang="ts" setup>
// components/collections/feeds/List.vue
import { useFeedCollectionStore } from '~/stores/feedCollectionStore'
import type {
  CreateRssFeedCollectionDto,
  UpdateRssFeedCollectionDto
} from '~/types/dtos/RssFeedCollectionDto'
import type { RssFeedCollection } from '~/types/entities/RssFeedCollection'

const feedCollectionStore = useFeedCollectionStore()
const isOpen = ref(false)
const isNewFeedCollection = ref(false)
const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Description', align: 'start', key: 'description' },
  { title: 'Actions', align: 'start', key: 'actions', sortable: false }
]

// Snackbar pour les notifications
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const form = ref<CreateRssFeedCollectionDto>({
  name: '',
  description: ''
})

// Créer ou mettre à jour un flux
const submitForm = async (values: CreateRssFeedCollectionDto | UpdateRssFeedCollectionDto) => {
  let response
  if (isNewFeedCollection.value) {
    response = await feedCollectionStore.createFeedCollection(values as CreateRssFeedCollectionDto)
  } else if (isUpdateDto(values)) {
    const { id, ...dto } = values
    response = await feedCollectionStore.updateFeedCollection(id!, dto)
  } else {
    console.error('Le DTO pour la mise à jour est invalide.')
    return
  }

  for (const message of response.message) {
    showSnackbar(message, response.success ? 'success' : 'error')
  }
  if (response.success) closeModal()
}

// Type guard pour vérifier si l'objet est CreateRssFeedCollectionDto
function isUpdateDto(
  dto: CreateRssFeedCollectionDto | UpdateRssFeedCollectionDto
): dto is UpdateRssFeedCollectionDto {
  return 'id' in dto
}

// Supprimer un flux
const deleteFeed = async (feed: RssFeedCollection) => {
  if (confirm('Voulez-vous vraiment supprimer ce flux ?')) {
    const response = await feedCollectionStore.deleteFeedCollection(feed.id)

    for (const message of response.message) {
      showSnackbar(message, response.success ? 'success' : 'error')
    }
  }
}

// Préparer la modification (fonction à compléter)
const updateFeed = (rssFeed: RssFeedCollection) => {
  const feed = feedCollectionStore.feedsCollection.find((feed) => feed.id === rssFeed.id)
  form.value = { ...feed }
  isOpen.value = true
  isNewFeedCollection.value = false
}

const newFeedCollection = () => {
  form.value = {
    name: '',
    description: ''
  }
  isOpen.value = true
  isNewFeedCollection.value = true

  console.log(isNewFeedCollection.value)
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
  form.value = { name: '', description: '' }
}
</script>
