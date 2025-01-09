// services/rssFeedService.ts

import { cleanEmptyStrings } from '~/services/cleanEmptyStrings'
import type { CreateRssFeedDto, UpdateRssFeedDto } from '~/types/dtos/RssFeedDto'

// Prépare le DTO pour la création
export function prepareCreateDto(formData: CreateRssFeedDto): CreateRssFeedDto {
  return {
    ...cleanEmptyStrings(formData),
    title: formData.title,
    url: formData.url
  }
}

// Prépare le DTO pour la mise à jour
export function prepareUpdateDto(formData: UpdateRssFeedDto): Partial<UpdateRssFeedDto> {
  return cleanEmptyStrings(formData)
}
