<template>
  <v-container v-if="articleStore.articles.length > 0">
    <div>
      <h1>All Articles</h1>
    </div>

    <v-row justify="end">
      <v-col cols="12" md="4">
        <v-select
          v-model="sortOrder"
          :items="[
            { text: 'Du plus récent au plus ancien', value: 'DESC' },
            { text: 'Du plus ancien au plus récent', value: 'ASC' }
          ]"
          dense
          item-title="text"
          item-value="value"
          label="Trier par date de publication"
          variant="outlined"
          @input="fetchArticles"
        ></v-select>
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          v-model="selectedTag"
          :items="availableTags"
          clearable
          dense
          label="Filtrer par tag"
          variant="outlined"
          @input="fetchArticles"
        ></v-select>
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          v-model="limit"
          :items="[10, 25, 50, 100]"
          dense
          label="Articles par page"
          variant="outlined"
          @input="fetchArticles"
        ></v-select>
      </v-col>
    </v-row>

    <transition-group name="fade" tag="div">
      <v-row v-for="article in articleStore.articles" :key="article.id">
        <v-col>
          <ArticlesCard :article="article" @open-article="openArticleDetails" />
        </v-col>
      </v-row>
    </transition-group>

    <v-pagination
      v-model="currentPage"
      :length="articleStore.totalPages"
      @input="fetchArticles"
    ></v-pagination>
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
import { debounce } from 'lodash'
// pages/articles.vue
import { computed, ref, watch } from 'vue'
import { ArticleService } from '~/services/ArticleService'
import { useArticleStore } from '~/stores/articleStore'
import type { Article } from '~/types/entities/Article'

const articleStore = useArticleStore()
const articleService = new ArticleService(articleStore)

// Drawer states
const drawer = ref(false)
const selectedArticle = ref<Article | null>(null)
const sortOrder = ref('DESC') // Valeur par défaut : du plus récent au plus ancien
const selectedTag = ref<string | null>(null) // Tag sélectionné pour filtrer
const currentPage = ref(1) // Current page for pagination
const limit = ref(25) // Default limit of articles per page

await useAsyncData(async () => {
  const params = {
    limit: limit.value,
    sortPublicationAt: sortOrder.value,
    page: currentPage.value
  }
  await articleService.getAll(params)
  console.log('Articles fetched in useAsyncData:', articleStore.articles) // Debugging
})

const availableTags = computed(() => {
  return Array.from(
    new Set(articleStore.articles?.flatMap((article: Article) => article.tags ?? []) ?? [])
  )
})

const fetchArticles = debounce(async () => {
  const params = {
    tag: selectedTag.value,
    limit: limit.value,
    sortPublicationAt: sortOrder.value,
    page: currentPage.value
  }
  await articleService.getAll(params)
}, 300)

watch(selectedTag, fetchArticles)
watch(sortOrder, fetchArticles)
watch(currentPage, fetchArticles)
watch(limit, fetchArticles)

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
