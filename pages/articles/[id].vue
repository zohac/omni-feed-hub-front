<template>
  <ArticlesArticle :article="selectedArticle" />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ArticleService } from '~/services/ArticleService'
import { useArticleStore } from '~/stores/articleStore'
import { Article } from '~/types/entities/Article'

const route = useRoute()
const articleStore = useArticleStore()
const articleService = new ArticleService(articleStore)
const id = Number(route.params.id)

const selectedArticle = ref<Article | null>(null)
selectedArticle.value = await articleService.getArticleById(id)
</script>
