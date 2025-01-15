// stores/articleCollectionStore.ts

import axios, { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { prepareCreateDto, prepareUpdateDto } from '~/services/articleCollectionService'
import type {
  CreateArticleCollectionDto,
  UpdateArticleCollectionDto
} from '~/types/dtos/ArticleCollectionDto'
import type { ApiErrorMessage } from '~/types/entities/ApiErrorMessage'
import type { ArticleCollection } from '~/types/entities/ArticleCollection'

export const useArticleCollectionStore = defineStore('articleCollection', {
  state: () => ({
    articlesCollection: [] as ArticleCollection[],
    articleCollection: null as ArticleCollection | null
  }),
  actions: {
    async fetchArticlesCollection() {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/collections/articles`)
        this.articlesCollection = data as ArticleCollection[]
      } catch (error) {
        console.error("Erreur lors de la récupération des Collections d'article :", error)
      }
    },

    async fetchArticleCollectionById(id: number) {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/collections/articles/${id}`)
        this.articleCollection = data as ArticleCollection
      } catch (error) {
        console.error("Erreur lors de la récupération de la Collection d'article :", error)
      }
    },

    async createArticleCollection(articleCollectionData: CreateArticleCollectionDto) {
      const apiBase = useRuntimeConfig().public.apiBase
      const dto = prepareCreateDto(articleCollectionData)

      try {
        const { data } = await axios.post(`${apiBase}/collections/articles`, dto)

        this.articlesCollection.push(data)
        await this.fetchArticlesCollection()

        return { success: true, message: ["Collection d'article ajouté avec succès"] }
      } catch (error) {
        return this.handleApiError(error, "Erreur lors de la création de la Collection d'article")
      }
    },

    async updateArticleCollection(id: number, updatedData: UpdateArticleCollectionDto) {
      const apiBase = useRuntimeConfig().public.apiBase
      const dto = prepareUpdateDto(updatedData)

      try {
        await axios.put(`${apiBase}/collections/articles/${id}`, dto)
        await this.fetchArticlesCollection()
        await this.fetchArticleCollectionById(id)
        return { success: true, message: ["Collection d'article mis à jour avec succès"] }
      } catch (error) {
        return this.handleApiError(
          error,
          "Erreur lors de la mise à jour de la Collection d'article"
        )
      }
    },

    async deleteArticleCollection(id: number) {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        await axios.delete(`${apiBase}/collections/articles/${id}`)
        this.articlesCollection = this.articlesCollection.filter((article) => article.id !== id)
        return { success: true, message: ["Collection d'article supprimé avec succès"] }
      } catch (error) {
        return this.handleApiError(
          error,
          "Erreur lors de la suppression de la Collection d'article"
        )
      }
    },

    // Gestion des erreurs API
    handleApiError(error: unknown, defaultMessage: string) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
        const data = axiosError.response?.data as ApiErrorMessage
        const message = data?.message || axiosError.message || defaultMessage
        // console.error(message)
        return { success: false, message }
      } else {
        // console.error(defaultMessage, error)
        return { success: false, message: defaultMessage }
      }
    }
  }
})
