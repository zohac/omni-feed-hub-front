<template>
  <div v-if="article">
    <!-- Boutons d'actions -->
    <v-container class="d-flex justify-end">
      <v-btn
        :color="article.state?.isFavorite ? 'yellow-darken-2' : 'grey'"
        :variant="article.state?.isFavorite ? 'flat' : 'outlined'"
        class="mr-5"
        icon
        @click="toggleFavorite"
      >
        <v-icon>mdi-star</v-icon>
      </v-btn>

      <v-btn
        :color="article.state?.isArchived ? 'blue-darken-2' : 'grey'"
        :variant="article.state?.isArchived ? 'flat' : 'outlined'"
        class="mr-5"
        icon
        @click="toggleArchived"
      >
        <v-icon>mdi-archive</v-icon>
      </v-btn>

      <v-btn
        :color="article.state?.isSaved ? 'green-darken-2' : 'grey'"
        :variant="article.state?.isSaved ? 'flat' : 'outlined'"
        class="mr-5"
        icon
        @click="toggleSaved"
      >
        <v-icon>mdi-bookmark</v-icon>
      </v-btn>
    </v-container>

    <v-divider></v-divider>

    <v-img
      v-if="article.mediaAttachments?.length"
      :src="article.mediaAttachments?.[0].url"
      class="mb-4"
      cover
      height="350px"
    ></v-img>
    <v-container>
      <h2 class="text-h4">{{ article.title }}</h2>
      <p class="text-subtitle-1 grey--text">Publié le {{ formatDate(article.publicationAt) }}</p>

      <v-divider class="my-4"></v-divider>

      <div class="article-content" v-html="article.content"></div>

      <v-chip v-for="tag in article.tags" :key="tag.id" class="ma-1" color="primary">
        {{ tag.label }}
      </v-chip>

      <v-divider class="my-4"></v-divider>

      <v-btn
        :href="article.link"
        block
        color="primary"
        flat
        size="large"
        target="_blank"
        variant="outlined"
      >
        Lire l'article complet
      </v-btn>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { useArticleStore } from '~/stores/articleStore'
import { Article } from '~/types/entities/Article'

const articleStore = useArticleStore()

const props = defineProps({
  article: {
    type: Object as () => Article,
    required: true
  }
})

// Événement d'émission
const emit = defineEmits(['article-updated'])

const toggleFavorite = async () => {
  if (!props.article) return

  props.article.state.isFavorite = !props.article.state.isFavorite
  await updateArticleState(props.article)
}

const toggleArchived = async () => {
  if (!props.article) return

  props.article.state.isArchived = !props.article.state.isArchived
  await updateArticleState(props.article)
}

const toggleSaved = async () => {
  if (!props.article) return

  props.article.state.isSaved = !props.article.state.isSaved
  await updateArticleState(props.article)
}

// Met à jour l'état de l'article via l'API
const updateArticleState = async (article: Article) => {
  if (article.id) {
    await articleStore.updateArticle(article.id, {
      state: article.state
    })
  }

  emit('article-updated', article)
}
</script>
