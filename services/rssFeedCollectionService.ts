// services/rssFeedService.ts

import { cleanEmptyStrings } from '~/services/cleanEmptyStrings'
import type {
  CreateRssFeedCollectionDto,
  UpdateRssFeedCollectionDto
} from '~/types/dtos/RssFeedCollectionDto' // Prépare le DTO pour la création

// Prépare le DTO pour la création
export function prepareCreateDto(formData: CreateRssFeedCollectionDto): CreateRssFeedCollectionDto {
  return {
    ...cleanEmptyStrings(formData),
    name: formData.name
  }
}

// Prépare le DTO pour la mise à jour
export function prepareUpdateDto(
  formData: UpdateRssFeedCollectionDto
): Partial<UpdateRssFeedCollectionDto> {
  return cleanEmptyStrings(formData)
}
