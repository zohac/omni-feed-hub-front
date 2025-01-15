// types/dtos/ActionDto.ts

import type { ActionType } from '~/types/enums/ActionType'

export abstract class CreateActionDto {
  name!: string
  type!: ActionType
}

export abstract class UpdateActionDto {
  id?: number
  name?: string
  type?: ActionType
}
