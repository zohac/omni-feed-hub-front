// services/rssFeedService.ts

import { cleanEmptyStrings } from '~/services/cleanEmptyStrings'
import type { CreateAiConfigurationDto } from '~/types/dtos/AiConfigurationDto'
import { UpdateAiConfigurationDto } from '~/types/dtos/AiConfigurationDto'

// Prépare le DTO pour la création
export function prepareCreateDto(formData: CreateAiConfigurationDto): CreateAiConfigurationDto {
  return {
    ...cleanEmptyStrings(formData),
    model: formData.model,
    prompt: formData.prompt,
    stream: formData.stream,
    temperature: formData.temperature
  }
}

// Prépare le DTO pour la mise à jour
export function prepareUpdateDto(
  formData: UpdateAiConfigurationDto
): Partial<UpdateAiConfigurationDto> {
  return cleanEmptyStrings(formData)
}
