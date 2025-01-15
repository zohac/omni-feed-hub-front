// services/aiActionService.ts

import { cleanEmptyStrings } from '~/services/cleanEmptyStrings'
import { CreateActionDto, UpdateActionDto } from '~/types/dtos/ActionDto'

// Prépare le DTO pour la création
export function prepareCreateDto(formData: CreateActionDto): CreateActionDto {
  return {
    ...cleanEmptyStrings(formData),
    name: formData.name,
    type: formData.type
  }
}

// Prépare le DTO pour la mise à jour
export function prepareUpdateDto(formData: UpdateActionDto): Partial<UpdateActionDto> {
  return {
    ...cleanEmptyStrings(formData)
  }
}
