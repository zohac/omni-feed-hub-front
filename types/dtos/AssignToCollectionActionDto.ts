// types/dtos/AssignToCollectionActionDto.ts

import { CreateActionDto, UpdateActionDto } from '~/types/dtos/ActionDto'

export class CreateAssignToCollectionActionDto extends CreateActionDto {
  collectionId!: number
}

export class UpdateAssignToCollectionActionDto extends UpdateActionDto {
  collectionId?: number
}
