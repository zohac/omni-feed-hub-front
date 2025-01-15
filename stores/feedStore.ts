import axios, { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { prepareCreateDto, prepareUpdateDto } from '~/services/rssFeedService'
import type { CreateRssFeedDto, UpdateRssFeedDto } from '~/types/dtos/RssFeedDto'
import type { ApiErrorMessage } from '~/types/entities/ApiErrorMessage'
import { RssFeed } from '~/types/entities/RssFeed'

export const useFeedStore = defineStore('feed', {
  state: () => ({
    feeds: [] as RssFeed[],
    feed: null as RssFeed | null
  }),
  actions: {
    async fetchFeeds() {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/feeds`)
        this.feeds = data as RssFeed[]
      } catch (error) {
        console.error('Erreur lors de la récupération des flux RSS:', error)
      }
    },

    async fetchFeedById(id: number) {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/feeds/${id}`)
        this.feed = data as RssFeed
      } catch (error) {
        console.error('Erreur lors de la récupération du flux RSS:', error)
      }
    },

    async createFeed(feedData: CreateRssFeedDto) {
      const apiBase = useRuntimeConfig().public.apiBase
      const dto = prepareCreateDto(feedData)

      try {
        const { data } = await axios.post(`${apiBase}/feeds`, dto)

        this.feeds.push(data)
        await this.fetchFeeds()

        return { success: true, message: ['Flux ajouté avec succès'] }
      } catch (error) {
        return this.handleApiError(error, 'Erreur lors de la création du flux')
      }
    },

    async updateFeed(id: number, updatedData: UpdateRssFeedDto) {
      const apiBase = useRuntimeConfig().public.apiBase
      console.log(updatedData)
      const dto = prepareUpdateDto(updatedData)

      try {
        await axios.put(`${apiBase}/feeds/${id}`, dto)
        await this.fetchFeeds()
        await this.fetchFeedById(id)
        return { success: true, message: ['Flux mis à jour avec succès'] }
      } catch (error) {
        return this.handleApiError(error, 'Erreur lors de la mise à jour du flux')
      }
    },

    async deleteFeed(id: number) {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        await axios.delete(`${apiBase}/feeds/${id}`)
        this.feeds = this.feeds.filter((feed) => feed.id !== id)
        return { success: true, message: ['Flux supprimé avec succès'] }
      } catch (error) {
        return this.handleApiError(error, 'Erreur lors de la suppression du flux')
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
