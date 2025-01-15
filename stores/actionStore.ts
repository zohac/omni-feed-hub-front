// stores/actionStore.ts

import axios, { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { prepareCreateDto, prepareUpdateDto } from '~/services/aiActionService'
import type { CreateActionDto, UpdateActionDto } from '~/types/dtos/ActionDto'
import type { Action } from '~/types/entities/Action'
import type { ApiErrorMessage } from '~/types/entities/ApiErrorMessage'

export const useActionStore = defineStore('action', {
  state: () => ({
    actions: [] as Action[],
    action: null as Action | null
  }),
  actions: {
    async fetchActions() {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/actions`)
        this.actions = data as Action[]
      } catch (error) {
        console.error('Erreur lors de la récupération des actions :', error)
      }
    },

    async fetchActionById(id: number) {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/actions/${id}`)
        this.action = data as Action
      } catch (error) {
        console.error("Erreur lors de la récupération de l'action :", error)
      }
    },

    async createAction(actionData: CreateActionDto) {
      const apiBase = useRuntimeConfig().public.apiBase
      const dto = prepareCreateDto(actionData)

      try {
        const { data } = await axios.post(`${apiBase}/actions`, dto)

        this.actions.push(data)
        await this.fetchActions()

        return { success: true, message: ['Action ajoutée avec succès'] }
      } catch (error) {
        return this.handleApiError(error, "Erreur lors de la création de l'action")
      }
    },

    async updateAction(id: number, updatedData: UpdateActionDto) {
      const apiBase = useRuntimeConfig().public.apiBase
      const dto = prepareUpdateDto(updatedData)

      try {
        await axios.put(`${apiBase}/actions/${id}`, dto)
        await this.fetchActions()
        await this.fetchActionById(id)
        return { success: true, message: ['Action mis à jour avec succès'] }
      } catch (error) {
        return this.handleApiError(error, "Erreur lors de la mise à jour de l'action")
      }
    },

    async deleteAction(id: number) {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        await axios.delete(`${apiBase}/actions/${id}`)
        this.actions = this.actions.filter((action) => action.id !== id)
        return { success: true, message: ['Action IA supprimé avec succès'] }
      } catch (error) {
        return this.handleApiError(error, "Erreur lors de la suppression de l'action")
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
