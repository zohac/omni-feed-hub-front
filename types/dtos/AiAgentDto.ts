// types/dtos/AiAgentDto.ts

import type {
  CreateAiConfigurationDto,
  UpdateAiConfigurationDto
} from '~/types/dtos/AiConfigurationDto'
import type { AiAgentProvider } from '~/types/enums/AiAgentProvider'
import type { AiAgentRole } from '~/types/enums/AiAgentRole'

export class CreateAiAgentDto {
  name!: string
  description!: string
  provider!: AiAgentProvider
  role!: AiAgentRole
  configuration!: CreateAiConfigurationDto
}

export class UpdateAiAgentDto {
  id?: number
  name?: string
  description?: string
  provider?: AiAgentProvider
  role?: AiAgentRole
  configuration!: UpdateAiConfigurationDto
}
