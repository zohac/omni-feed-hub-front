<template>
  <v-row>
    <v-col>
      <h1>Gestion des Flux RSS</h1>
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-form>
        <v-text-field
          v-model="url"
          append-inner-icon="mdi-send"
          class="bg-color-theme-surface"
          clearable
          color="primary"
          density="comfortable"
          hide-details="auto"
          label="RSS Feed Link"
          variant="outlined"
          @click:append-inner="parseFeed"
        />
      </v-form>
    </v-col>
  </v-row>

  <v-row v-if="rssFeedInfos">
    <v-col>
      <v-card class="bg-color-theme-surface" variant="outlined" width="400px">
        <v-row>
          <v-col>
            <v-card-title class="text-h5"> {{ rssFeedInfos.title }}</v-card-title>

            <v-card-subtitle> {{ rssFeedInfos.link }}</v-card-subtitle>

            <v-card-text>
              {{ rssFeedInfos.description }}
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-actions>
              <v-btn color="primary" text="Follow" variant="outlined" @click="saveFeed"></v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-data-table :headers="headers" :items="feedStore.feeds" class="data-table" item-value="id">
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
            @click="confirmDeleteFeed(item)"
          />
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <!-- Formulaire de mise à jour -->
  <v-navigation-drawer :model-value="isOpen" location="right" temporary width="900">
    <div>
      <v-container>
        <v-row>
          <v-col class="d-flex justify-start">
            <h2 class="d-flex align-center">Modifier le Flux Rss</h2>
          </v-col>
          <v-col class="d-flex justify-end">
            <v-btn
              v-tooltip:top="'Fermer'"
              icon="mdi-close"
              variant="outlined"
              @click="isOpen = !isOpen"
            ></v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-divider></v-divider>

      <FeedsForm :form-data="form" @form-submit="submitForm" />
    </div>
  </v-navigation-drawer>

  <v-dialog v-model="confirmDialog.show" max-width="500px">
    <v-card>
      <v-card-title class="text-h6"> Confirmer la suppression</v-card-title>
      <v-card-text>
        Voulez-vous vraiment supprimer le flux RSS
        <strong>{{ confirmDialog.feed?.title }}</strong> ?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="confirmDialog.show = false"> Annuler</v-btn>
        <v-btn color="error" @click="deleteConfirmedFeed"> Supprimer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Snackbar pour les Messages Flash -->
  <CoreAppSnackbar v-model="snackbar.show" :color="snackbar.color" :message="snackbar.message" />
</template>

<script lang="ts" setup>
// components/feeds/List.vue

// components/feeds/List.vue
import { RssFeedService } from '~/services/rssFeedService'
import { useFeedStore } from '~/stores/feedStore'
import type { UpdateRssFeedDto } from '~/types/dtos/RssFeedDto'
import type { RssFeed } from '~/types/entities/RssFeed'
import type { RssFeedInfos } from '~/types/entities/RssFeedInfos'

const feedStore = useFeedStore()
const isOpen = ref(false)
const url = ref<string>('')
const rssFeedInfos = ref<RssFeedInfos | null>(null)
const confirmDialog = ref({
  show: false,
  feed: null as RssFeed | null
})

const form = ref<UpdateRssFeedDto>({
  id: undefined,
  title: '',
  url: '',
  description: '',
  collectionId: undefined
})
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

const feedService = new RssFeedService(feedStore)

const parseFeed = async () => {
  rssFeedInfos.value = await feedService.parseURL(url.value)
}

const saveFeed = async () => {
  if (!rssFeedInfos.value) {
    return
  }

  const response = await feedService.createFeed(url.value, rssFeedInfos.value)
  rssFeedInfos.value = null

  for (const message of response.message) {
    showSnackbar(message, response.success ? 'success' : 'error')
  }
}

// Préparer la modification (fonction à compléter)
const updateFeed = async (rssFeed: RssFeed) => {
  const feed = await feedService.getFeedById(rssFeed.id)

  if (!feed) {
    showSnackbar('Flux Rss non trouvé', 'error')
  }

  form.value = { ...feed }
  isOpen.value = true
}

// mettre à jour un flux
const submitForm = async (values: UpdateRssFeedDto) => {
  const response = await feedService.updateFeed(values)

  if (response.success) isOpen.value = false

  for (const message of response.message) {
    showSnackbar(message, response.success ? 'success' : 'error')
  }
}

// Supprimer un flux
const confirmDeleteFeed = (feed: RssFeed) => {
  confirmDialog.value = {
    show: true,
    feed
  }
}

const deleteConfirmedFeed = async () => {
  if (!confirmDialog.value.feed) {
    confirmDialog.value = { show: false, feed: null }
    return
  }

  const response = await feedService.deleteFeed(confirmDialog.value.feed.id)

  for (const message of response.message) {
    showSnackbar(message, response.success ? 'success' : 'error')
  }

  // Réinitialisez le dialog
  confirmDialog.value = { show: false, feed: null }
}

// Afficher les messages flash
const showSnackbar = (message: string, color: 'success' | 'error') => {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.show = true
}
</script>

<style scoped>
.data-table {
  border: 1px rgba(var(--v-border-color), var(--v-medium-emphasis-opacity)) solid;
  border-radius: 4px;
}

.bg-color-theme-surface {
  background-color: rgb(var(--v-theme-surface));
}
</style>
