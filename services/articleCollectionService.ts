// services/articleCollectionService.ts

import { cleanEmptyStrings } from '~/services/cleanEmptyStrings'
import type {
  CreateArticleCollectionDto,
  UpdateArticleCollectionDto
} from '~/types/dtos/ArticleCollectionDto' // Prépare le DTO pour la création

// Prépare le DTO pour la création
export function prepareCreateDto(formData: CreateArticleCollectionDto): CreateArticleCollectionDto {
  return {
    ...cleanEmptyStrings(formData),
    name: formData.name
  }
}

// Prépare le DTO pour la mise à jour
export function prepareUpdateDto(
  formData: UpdateArticleCollectionDto
): Partial<UpdateArticleCollectionDto> {
  return cleanEmptyStrings(formData)
}
