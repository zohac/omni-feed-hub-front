<template>
  <v-row>
    <v-col>
      <h1>Gestion des Collections d'Articles</h1>
    </v-col>

    <v-col class="d-flex justify-end align-center">
      <v-btn
        color="primary"
        text="Ajouter une Collection d'articles"
        @click="newArticleCollection"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="articleCollectionStore.articlesCollection"
        class="data-table"
        item-value="id"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            v-tooltip:top="'Modifier'"
            class="me-2"
            color="primary"
            density="comfortable"
            icon="mdi-pencil"
            @click="updateArticle(item)"
          />

          <v-btn
            v-tooltip:top="'Supprimer'"
            color="error"
            density="comfortable"
            icon="mdi-delete"
            @click="deleteArticle(item)"
          />
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <!-- Formulaire de création -->
  <v-dialog v-model="isOpen" class="d-flex align-center justify-center" max-width="500">
    <CollectionsArticlesForm
      :form-data="form"
      :is-new-article-collection="isNewArticleCollection"
      @form-submit="submitForm"
    />
  </v-dialog>

  <!-- Snackbar pour les Messages Flash -->
  <CoreAppSnackbar v-model="snackbar.show" :color="snackbar.color" :message="snackbar.message" />
</template>

<script lang="ts" setup>
// components/collections/articles/List.vue
import { useArticleCollectionStore } from '~/stores/articleCollectionStore'
import type {
  CreateArticleCollectionDto,
  UpdateArticleCollectionDto
} from '~/types/dtos/ArticleCollectionDto'
import type { ArticleCollection } from '~/types/entities/ArticleCollection'

const articleCollectionStore = useArticleCollectionStore()
const isOpen = ref(false)
const isNewArticleCollection = ref(false)
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

const form = ref<CreateArticleCollectionDto>({
  name: '',
  description: ''
})

// Créer ou mettre à jour un flux
const submitForm = async (values: CreateArticleCollectionDto | UpdateArticleCollectionDto) => {
  let response
  if (isNewArticleCollection.value) {
    response = await articleCollectionStore.createArticleCollection(
      values as CreateArticleCollectionDto
    )
  } else if (isUpdateDto(values)) {
    const { id, articles, ...dto } = values
    response = await articleCollectionStore.updateArticleCollection(id!, dto)
  } else {
    console.error('Le DTO pour la mise à jour est invalide.')
    return
  }

  for (const message of response.message) {
    showSnackbar(message, response.success ? 'success' : 'error')
  }
  if (response.success) closeModal()
}

// Type guard pour vérifier si l'objet est CreateArticleCollectionDto
function isUpdateDto(
  dto: CreateArticleCollectionDto | UpdateArticleCollectionDto
): dto is UpdateArticleCollectionDto {
  return 'id' in dto
}

// Supprimer un flux
const deleteArticle = async (article: ArticleCollection) => {
  if (confirm('Voulez-vous vraiment supprimer ce flux ?')) {
    const response = await articleCollectionStore.deleteArticleCollection(article.id)

    for (const message of response.message) {
      showSnackbar(message, response.success ? 'success' : 'error')
    }
  }
}

// Préparer la modification (fonction à compléter)
const updateArticle = (articleCollection: ArticleCollection) => {
  const article = articleCollectionStore.articlesCollection.find(
    (article) => article.id === articleCollection.id
  )
  form.value = { ...article }
  isOpen.value = true
  isNewArticleCollection.value = false
}

const newArticleCollection = () => {
  form.value = {
    name: '',
    description: ''
  }
  isOpen.value = true
  isNewArticleCollection.value = true

  console.log(isNewArticleCollection.value)
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

<style scoped>
.data-table {
  border: 1px rgba(var(--v-border-color), var(--v-medium-emphasis-opacity)) solid;
  border-radius: 4px;
}
</style>
