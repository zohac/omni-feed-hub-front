// stores/statsStore.ts
import axios, { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import type { ApiErrorMessage } from '~/types/entities/ApiErrorMessage'
import type { RssFeedStats } from '~/types/entities/RssFeedStats'
import type { ISnackMessage } from '~/types/interfaces/ISnackMessage'

export const useStatsStore = defineStore('stats', {
  state: () => ({
    stats: [] as RssFeedStats[]
  }),
  actions: {
    async fetchStats(): Promise<void> {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/stats`)
        this.stats = data as RssFeedStats[]
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des flux RSS:', error)
      }
    },

    // Gestion des erreurs API
    handleApiError(error: unknown, defaultMessage: string): ISnackMessage {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
        const data = axiosError.response?.data as ApiErrorMessage
        const message = data?.message || axiosError.message || defaultMessage
        // console.error(message)
        return { success: false, message }
      } else {
        // console.error(defaultMessage, error)
        return { success: false, message: [defaultMessage] }
      }
    }
  }
})
