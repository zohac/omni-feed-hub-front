import type { CreateRssFeedDto, UpdateRssFeedDto } from '~/types/dtos/RssFeedDto'

// Nettoyage des champs optionnels
function cleanEmptyStrings<T>(dto: T): Partial<T> {
  const cleaned: Partial<T> = {}

  for (const key in dto) {
    const value = dto[key as keyof T]

    // Si la valeur n'est pas une chaîne vide, on l'ajoute
    if (value !== '') {
      cleaned[key as keyof T] = value
    }
  }
  return cleaned
}

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
