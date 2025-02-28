// stores/mainStore.ts

import { defineStore } from 'pinia'
import type { ISnackMessage } from '~/types/interfaces/ISnackMessage'

export const useMainStore = defineStore('main', {
  state: () => ({
    snackMessage: null as ISnackMessage | null
  }),
  actions: {}
})
