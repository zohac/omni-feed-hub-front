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
          variant="outlined"
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
          <ArticlesCard :article="article" @open-article="openArticleDetails" />
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
      <ArticlesArticle :article="selectedArticle" @article-updated="updateFeed" />
    </div>
    <v-container v-else>
      <v-alert type="info">Chargement de l'article...</v-alert>
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ArticleService } from '~/services/ArticleService'
import { RssFeedService } from '~/services/rssFeedService'
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
const feedService = new RssFeedService(feedStore)
const articleService = new ArticleService(articleStore)

await useAsyncData(async () => {
  await feedService.getFeedById(id)
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
  const article = await articleService.getArticleById(articleId)

  if (!article) return

  if (article.state) {
    article.state.isRead = true

    await articleService.updateArticle(article.id, { state: article.state })
  }

  drawer.value = true
  selectedArticle.value = await articleService.getArticleById(articleId)
  await feedService.getFeedById(id)
}

// Met à jour l'état de l'article via l'API
const updateFeed = async (article: Article) => {
  if (article.feed) await feedStore.fetchFeedById(article.feed?.id)
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
