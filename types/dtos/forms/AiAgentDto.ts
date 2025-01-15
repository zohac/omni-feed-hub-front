// types/dtos/forms/AiAgentDto.ts

import type { AiConfigurationDto } from '~/types/dtos/forms/AiConfigurationDto'
import type { AiAgentProvider } from '~/types/enums/AiAgentProvider'
import type { AiAgentRole } from '~/types/enums/AiAgentRole'

export class AiAgentDto {
  name!: string
  description!: string
  provider!: AiAgentProvider
  role!: AiAgentRole
  configuration!: AiConfigurationDto
}
