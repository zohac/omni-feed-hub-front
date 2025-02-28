// stores/workflowStore.ts

import axios, { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import type { AgentWorkflowDto } from '~/types/dtos/AgentWorkflowDto'
import type { AgentWorkflow } from '~/types/entities/AgentWorkflow'
import type { ApiErrorMessage } from '~/types/entities/ApiErrorMessage'
import type { ISnackMessage } from '~/types/interfaces/ISnackMessage'

export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    workflows: [] as AgentWorkflow[],
    workflow: null as AgentWorkflow | null
  }),
  actions: {
    async fetchWorkflows(): Promise<void> {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/workflows`)
        this.workflows = data as AgentWorkflow[]
      } catch (error) {
        console.error('Erreur lors de la récupération des flux RSS:', error)
      }
    },

    async fetchWorkflowById(id: number): Promise<void> {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/workflows/${id}`)
        this.workflow = data as AgentWorkflow
      } catch (error) {
        console.error('Erreur lors de la récupération du flux RSS:', error)
      }
    },

    async createWorkflow(dto: AgentWorkflowDto): Promise<ISnackMessage> {
      const apiBase = useRuntimeConfig().public.apiBase

      try {
        const { data } = await axios.post(`${apiBase}/workflows`, dto)

        this.workflows.push(data)
        this.workflow = data as AgentWorkflow

        await this.fetchWorkflows()

        return { success: true, message: ['Workflow ajouté avec succès'] }
      } catch (error) {
        return this.handleApiError(error, "Erreur lors de la création de l'action")
      }
    },

    async updateWorkflow(id: number, dto: AgentWorkflowDto): Promise<ISnackMessage> {
      const apiBase = useRuntimeConfig().public.apiBase

      try {
        await axios.put(`${apiBase}/workflows/${id}`, dto)
        await this.fetchWorkflows()
        await this.fetchWorkflowById(id)
        return { success: true, message: ['Workflow mis à jour avec succès'] }
      } catch (error) {
        return this.handleApiError(error, 'Erreur lors de la mise à jour du Workflow')
      }
    },

    async deleteWorkflow(id: number): Promise<ISnackMessage> {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        await axios.delete(`${apiBase}/workflows/${id}`)
        this.workflows = this.workflows.filter((workflow) => workflow.id !== id)
        return { success: true, message: ['Workflow supprimé avec succès'] }
      } catch (error) {
        return this.handleApiError(error, 'Erreur lors de la suppression du workflow')
      }
    },

    // Gestion des erreurs API
    handleApiError(error: unknown, defaultMessage: string): ISnackMessage {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
        const data = axiosError.response?.data as ApiErrorMessage
        const message = data?.message || axiosError.message || [defaultMessage]
        // console.error(message)
        return { success: false, message }
      } else {
        // console.error(defaultMessage, error)
        return { success: false, message: [defaultMessage] }
      }
    }
  }
})
