// services/rssFeedService.ts

import {
  prepareCreateDto as prepareCreateAiConfiguration,
  prepareUpdateDto as prepareUpdateAiConfiguration
} from '~/services/aiConfigurationService'
import { cleanEmptyStrings } from '~/services/cleanEmptyStrings'
import { CreateAiAgentDto, UpdateAiAgentDto } from '~/types/dtos/AiAgentDto'
import type { CreateAiConfigurationDto } from '~/types/dtos/AiConfigurationDto'
import { UpdateAiConfigurationDto } from '~/types/dtos/AiConfigurationDto'

// Prépare le DTO pour la création
export function prepareCreateDto(formData: CreateAiAgentDto): CreateAiAgentDto {
  const configuration: CreateAiConfigurationDto = prepareCreateAiConfiguration(
    formData.configuration
  )

  return {
    ...cleanEmptyStrings(formData),
    name: formData.name,
    description: formData.description,
    provider: formData.provider,
    role: formData.role,
    configuration: configuration
  }
}

// Prépare le DTO pour la mise à jour
export function prepareUpdateDto(formData: UpdateAiAgentDto): Partial<UpdateAiAgentDto> {
  const configuration: UpdateAiConfigurationDto = prepareUpdateAiConfiguration(
    formData.configuration
  )

  return {
    ...cleanEmptyStrings(formData),
    configuration: configuration
  }
}
