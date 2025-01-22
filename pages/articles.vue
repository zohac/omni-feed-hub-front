<template>
  <v-container v-if="articleStore.articles">
    <div>
      <h1>All Articles</h1>
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
      <v-row v-for="article in sortedArticles" v-if="articleStore.articles" :key="article.id">
        <v-col>
          <ArticlesCard :article="article" @open-article="openArticleDetails" />
        </v-col>
      </v-row>
    </transition-group>
  </v-container>
  <v-container v-else type="error">
    <v-alert> Articles introuvable.</v-alert>
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
      <ArticlesArticle :article="selectedArticle" @article-updated="updateArticle" />
    </div>
    <v-container v-else>
      <v-alert type="info">Chargement de l'article...</v-alert>
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ArticleService } from '~/services/ArticleService'
import { useArticleStore } from '~/stores/articleStore'
import { Article } from '~/types/entities/Article'

const articleStore = useArticleStore()
const articleService = new ArticleService(articleStore)

// Drawer states
const drawer = ref(false)
const selectedArticle = ref<Article | null>(null)
const sortOrder = ref('desc') // Valeur par défaut : du plus récent au plus ancien

await useAsyncData(async () => {
  await articleStore.fetchArticles()
})

const sortedArticles = computed(() => {
  if (!articleStore.articles) return []

  return [...articleStore.articles].sort((a, b) => {
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
  await articleService.getAll()
}

// Met à jour l'état de l'article via l'API
const updateArticle = async (article: Article) => {
  selectedArticle.value = await articleService.getArticleById(article.id)
  await articleService.getAll()
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
