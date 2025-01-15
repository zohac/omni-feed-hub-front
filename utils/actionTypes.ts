// utils/actionTypes.ts

import { ActionType } from '~/types/enums/ActionType'

export const actionTypes = {
  items: [
    { value: ActionType.ASSIGN_TO_COLLECTION, text: 'Assign to Collection' },
    { value: ActionType.OTHER_TYPE, text: 'Other type' }
    // Ajouter d'autres types ici si nécessaire
  ],

  find(value: string) {
    return this.items.find((item) => item.value === value) || undefined
  }
}
