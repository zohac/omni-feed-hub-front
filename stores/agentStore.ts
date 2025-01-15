// stores/agentStore.ts

import axios, { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import type { CreateAiAgentDto, UpdateAiAgentDto } from '~/types/dtos/AiAgentDto'
import type { AiAgent } from '~/types/entities/AiAgent'
import type { ApiErrorMessage } from '~/types/entities/ApiErrorMessage'

export const useAgentStore = defineStore('agent', {
  state: () => ({
    agents: [] as AiAgent[],
    agent: null as AiAgent | null
  }),
  actions: {
    async fetchAgents() {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/agents`)
        this.agents = data as AiAgent[]
      } catch (error) {
        console.error('Erreur lors de la récupération des flux RSS:', error)
      }
    },

    async fetchAgentById(id: number) {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/agents/${id}`)
        this.agent = data as AiAgent
      } catch (error) {
        console.error('Erreur lors de la récupération du flux RSS:', error)
      }
    },

    async createAgent(dto: CreateAiAgentDto) {
      const apiBase = useRuntimeConfig().public.apiBase

      try {
        const { data } = await axios.post(`${apiBase}/agents`, dto)

        this.agents.push(data)
        await this.fetchAgents()

        return { success: true, message: ['Agent IA ajouté avec succès'] }
      } catch (error) {
        return this.handleApiError(error, 'Erreur lors de la création du flux')
      }
    },

    async updateAgent(id: number, dto: UpdateAiAgentDto) {
      const apiBase = useRuntimeConfig().public.apiBase

      try {
        await axios.put(`${apiBase}/agents/${id}`, dto)
        await this.fetchAgents()
        await this.fetchAgentById(id)
        return { success: true, message: ['Agent IA mis à jour avec succès'] }
      } catch (error) {
        return this.handleApiError(error, 'Erreur lors de la mise à jour du flux')
      }
    },

    async deleteAgent(id: number) {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        await axios.delete(`${apiBase}/agents/${id}`)
        this.agents = this.agents.filter((agent) => agent.id !== id)
        return { success: true, message: ['Agent IA supprimé avec succès'] }
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
