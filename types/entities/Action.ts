// types/entities/action.ts

import type { AssignToCollectionAction } from '~/types/entities/AssignToCollectionAction'
import type { ActionType } from '~/types/enums/ActionType'

export interface IBaseAction {
  id: number
  name: string
  type: ActionType
}

export type Action = AssignToCollectionAction
