import axios, { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { prepareCreateDto, prepareUpdateDto } from '~/services/rssFeedCollectionService'
import type {
  CreateRssFeedCollectionDto,
  UpdateRssFeedCollectionDto
} from '~/types/dtos/RssFeedCollectionDto'
import type { ApiErrorMessage } from '~/types/entities/ApiErrorMessage'
import type { RssFeedCollection } from '~/types/entities/RssFeedCollection'

export const useFeedCollectionStore = defineStore('feedCollection', {
  state: () => ({
    feedsCollection: [] as RssFeedCollection[],
    feedCollection: null as RssFeedCollection | null
  }),
  actions: {
    async fetchFeedsCollection() {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/collections/feeds`)
        this.feedsCollection = data as RssFeedCollection[]
      } catch (error) {
        console.error('Erreur lors de la récupération des Collections de flux RSS:', error)
      }
    },

    async fetchFeedCollectionById(id: number) {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/collections/feeds/${id}`)
        this.feedCollection = data as RssFeedCollection
      } catch (error) {
        console.error('Erreur lors de la récupération de la Collection de flux RSS:', error)
      }
    },

    async createFeedCollection(feedCollectionData: CreateRssFeedCollectionDto) {
      const apiBase = useRuntimeConfig().public.apiBase
      const dto = prepareCreateDto(feedCollectionData)

      try {
        const { data } = await axios.post(`${apiBase}/collections/feeds`, dto)
        this.feedsCollection.push(data)
        return { success: true, message: 'Flux ajouté avec succès' }
      } catch (error) {
        return this.handleApiError(error, 'Erreur lors de la création de la Collection de flux')
      }
    },

    async updateFeedCollection(id: number, updatedData: UpdateRssFeedCollectionDto) {
      const apiBase = useRuntimeConfig().public.apiBase
      const dto = prepareUpdateDto(updatedData)

      try {
        await axios.put(`${apiBase}/collections/feeds/${id}`, dto)
        await this.fetchFeedsCollection()
        await this.fetchFeedCollectionById(id)
        return { success: true, message: 'Flux mis à jour avec succès' }
      } catch (error) {
        return this.handleApiError(error, 'Erreur lors de la mise à jour de la Collection de flux')
      }
    },

    async deleteFeedCollection(id: number) {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        await axios.delete(`${apiBase}/collections/feeds/${id}`)
        this.feedsCollection = this.feedsCollection.filter((feed) => feed.id !== id)
        return { success: true, message: 'Flux supprimé avec succès' }
      } catch (error) {
        return this.handleApiError(error, 'Erreur lors de la suppression de la Collection de flux')
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
