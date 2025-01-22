import axios, { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import type { ArticleDto } from '~/types/dtos/ArticleDto'
import type { ApiErrorMessage } from '~/types/entities/ApiErrorMessage'
import type { Article } from '~/types/entities/Article'
import type { ISnackMessage } from '~/types/interfaces/ISnackMessage'

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: [] as Article[],
    article: null as Article | null
  }),
  actions: {
    async fetchArticles() {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/articles`)
        this.articles = data
      } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error)
      }
    },

    async fetchArticleById(id: number) {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/articles/${id}`)
        this.article = data
      } catch (error) {
        console.error('Article non trouvé:', error)
      }
    },

    async createArticle(articleData: Partial<Article>): Promise<ISnackMessage> {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.post(`${apiBase}/articles`, articleData)

        this.articles.push(data)
        await this.fetchArticles()

        return { success: true, message: ['Article créé avec succès'] }
      } catch (error) {
        return this.handleApiError(error, "Erreur lors de la création de l'article")
      }
    },

    async updateArticle(id: number, articleData: ArticleDto): Promise<ISnackMessage> {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        await axios.put(`${apiBase}/articles/${id}`, articleData)
        await this.fetchArticles()
        return { success: true, message: ['Article mis à jour avec succès'] }
      } catch (error) {
        return this.handleApiError(error, 'Erreur lors de la mise à jour')
      }
    },

    async deleteArticle(id: number): Promise<ISnackMessage> {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        await axios.delete(`${apiBase}/articles/${id}`)
        this.articles = this.articles.filter((article) => article.id !== id)
        return { success: true, message: ['Article supprimé'] }
      } catch (error) {
        return this.handleApiError(error, 'Erreur lors de la suppression')
      }
    },

    handleApiError(error: unknown, defaultMessage: string): ISnackMessage {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
        const data = axiosError.response?.data as ApiErrorMessage
        const message = data?.message || defaultMessage
        console.error(message)
        return { success: false, message }
      } else {
        console.error(defaultMessage, error)
        return { success: false, message: [defaultMessage] }
      }
    }
  }
})
