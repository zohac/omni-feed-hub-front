<template>
  <v-container v-if="feedStore.feed">
    <div>
      <h1>{{ feedStore.feed.title }}</h1>
      <p class="text-subtitle-1 font-weight-light text-grey-darken-1">
        {{ feedStore.feed.description }}
      </p>
      <p class="text-subtitle-1 font-weight-light text-grey-darken-1">
        URL : {{ feedStore.feed.url }}
      </p>
    </div>

    <v-row justify="end">
      <v-col cols="12" md="4">
        <v-select
          v-model="sortOrder"
          :items="[
            { text: 'Du plus récent au plus ancien', value: 'desc' },
            { text: 'Du plus ancien au plus récent', value: 'asc' }
          ]"
          dense
          item-title="text"
          item-value="value"
          label="Trier par date de publication"
          outlined
        ></v-select>
      </v-col>
    </v-row>

    <transition-group name="fade" tag="div">
      <v-row
        v-for="article in sortedArticles"
        v-if="feedStore.feed?.articles?.length"
        :key="article.id"
      >
        <v-col>
          <v-card :flat="article.state.isRead">
            <div class="d-flex flex-no-wrap justify-space-between">
              <v-img
                v-if="article.mediaAttachments?.length"
                :src="article.mediaAttachments?.[0].url"
                cover
                max-width="300px"
                width="300px"
              ></v-img>
              <div>
                <v-card-title
                  class="cursor-pointer text-primary wrap-title"
                  @click="openArticleDetails(article.id)"
                  >{{ article.title }}
                </v-card-title>
                <v-card-subtitle>
                  {{ formatDate(article.publicationAt) }}
                </v-card-subtitle>
                <v-card-text :class="{ 'text-grey-darken-1': article.state.isRead }">
                  {{ article.description }}
                </v-card-text>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </transition-group>
  </v-container>
  <v-container v-else type="error">
    <v-alert> Flux introuvable.</v-alert>
  </v-container>

  <!-- Drawer pour afficher les détails de l'article -->
  <v-navigation-drawer
    v-model="drawer"
    class="full-height-drawer"
    location="right"
    temporary
    width="900"
  >
    <div v-if="selectedArticle">
      <!-- Boutons d'actions -->
      <v-container class="d-flex justify-end">
        <v-btn
          :color="selectedArticle.state?.isFavorite ? 'yellow-darken-2' : 'grey'"
          :variant="selectedArticle.state?.isFavorite ? 'flat' : 'outlined'"
          class="mr-5"
          icon
          @click="toggleFavorite"
        >
          <v-icon>mdi-star</v-icon>
        </v-btn>

        <v-btn
          :color="selectedArticle.state?.isArchived ? 'blue-darken-2' : 'grey'"
          :variant="selectedArticle.state?.isArchived ? 'flat' : 'outlined'"
          class="mr-5"
          icon
          @click="toggleArchived"
        >
          <v-icon>mdi-archive</v-icon>
        </v-btn>

        <v-btn
          :color="selectedArticle.state?.isSaved ? 'green-darken-2' : 'grey'"
          :variant="selectedArticle.state?.isSaved ? 'flat' : 'outlined'"
          class="mr-5"
          icon
          @click="toggleSaved"
        >
          <v-icon>mdi-bookmark</v-icon>
        </v-btn>
      </v-container>

      <v-divider></v-divider>

      <v-img
        v-if="selectedArticle.mediaAttachments?.length"
        :src="selectedArticle.mediaAttachments?.[0].url"
        class="mb-4"
        cover
        height="350px"
      ></v-img>
      <v-container>
        <h1 class="text-h4">{{ selectedArticle.title }}</h1>
        <p class="text-subtitle-1 grey--text">
          Publié le {{ formatDate(selectedArticle.publicationAt) }}
        </p>

        <v-divider class="my-4"></v-divider>

        <div class="article-content" v-html="selectedArticle.content"></div>

        <v-chip v-for="tag in selectedArticle.tags" :key="tag.id" class="ma-1" color="primary">
          {{ tag.label }}
        </v-chip>

        <v-divider class="my-4"></v-divider>

        <v-btn
          :href="selectedArticle.link"
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
    <v-container v-else>
      <v-alert type="info">Chargement de l'article...</v-alert>
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useArticleStore } from '~/stores/articleStore'
import { useFeedStore } from '~/stores/feedStore'
import { Article } from '~/types/entities/Article'

const route = useRoute()
const feedStore = useFeedStore()
const articleStore = useArticleStore()
const id = Number(route.params.id)

// Drawer states
const drawer = ref(false)
const selectedArticle = ref<Article | null>(null)
const sortOrder = ref('desc') // Valeur par défaut : du plus récent au plus ancien

await useAsyncData(async () => {
  await feedStore.fetchFeedById(id)
})

const sortedArticles = computed(() => {
  if (!feedStore.feed?.articles) return []

  return [...feedStore.feed.articles].sort((a, b) => {
    const dateA = new Date(a.publicationAt).getTime()
    const dateB = new Date(b.publicationAt).getTime()

    return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA
  })
})

// Ouvre le drawer avec les détails de l'article
const openArticleDetails = async (articleId: number) => {
  await articleStore.fetchArticleById(articleId)

  if (!articleStore.article) return

  const article = articleStore.article

  if (article.state) article.state.isRead = true
  await updateArticleState(article)

  drawer.value = true
  selectedArticle.value = null // Reset en attendant la réponse
  selectedArticle.value = articleStore.article
}

const toggleFavorite = async () => {
  if (!selectedArticle.value) return

  selectedArticle.value.state.isFavorite = !selectedArticle.value.state.isFavorite
  await updateArticleState(selectedArticle.value)
}

const toggleArchived = async () => {
  if (!selectedArticle.value) return

  selectedArticle.value.state.isArchived = !selectedArticle.value.state.isArchived
  await updateArticleState(selectedArticle.value)
}

const toggleSaved = async () => {
  if (!selectedArticle.value) return

  selectedArticle.value.state.isSaved = !selectedArticle.value.state.isSaved
  await updateArticleState(selectedArticle.value)
}

// Met à jour l'état de l'article via l'API
const updateArticleState = async (article: Article) => {
  if (article.id) {
    await articleStore.updateArticle(article.id, {
      state: article.state
    })
  }

  await feedStore.fetchFeedById(id)
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.full-height-drawer {
  position: fixed;
  height: 100%;
  top: 0;
}

.v-navigation-drawer__scrim {
  height: 100% !important;
  position: fixed;
}

.wrap-title {
  white-space: normal;
  word-wrap: break-word;
}
</style>
