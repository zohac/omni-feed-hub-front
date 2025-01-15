// services/rssFeedService.ts

import { useAgentStore } from '~/stores/agentStore'
import { CreateAiAgentDto, UpdateAiAgentDto } from '~/types/dtos/AiAgentDto'
import { CreateAiConfigurationDto, UpdateAiConfigurationDto } from '~/types/dtos/AiConfigurationDto'
import type { AiAgentDto } from '~/types/dtos/forms/AiAgentDto'

// Déclare le type du store Pinia
type AgentStore = ReturnType<typeof useAgentStore>

export class AiAgentService {
  constructor(private readonly agentStore: AgentStore) {}

  async createAgent(formData: AiAgentDto) {
    const dto = this.mapCreateAiAgentDto(formData)

    return await this.agentStore.createAgent(dto)
  }

  async updateAgent(id: number, formData: AiAgentDto) {
    const dto = this.mapUpdateAiAgentDto(formData)

    return await this.agentStore.updateAgent(id, dto)
  }

  private mapUpdateAiAgentDto(formData: AiAgentDto): UpdateAiAgentDto {
    const dto = new UpdateAiAgentDto()

    if (formData.name) dto.name = formData.name
    if (formData.description) dto.description = formData.description
    if (formData.provider) dto.provider = formData.provider
    if (formData.role) dto.role = formData.role
    if (formData.configuration) dto.configuration = this.mapUpdateConfigurationDto(formData)

    return dto
  }

  private mapUpdateConfigurationDto(formData: AiAgentDto): UpdateAiConfigurationDto {
    const dto = new UpdateAiConfigurationDto()

    if (formData.configuration.model) dto.model = formData.configuration.model
    if (formData.configuration.prompt) dto.prompt = formData.configuration.prompt
    if (formData.configuration.stream) dto.stream = formData.configuration.stream
    if (formData.configuration.temperature) dto.temperature = formData.configuration.temperature

    return dto
  }

  private mapCreateAiAgentDto(formData: AiAgentDto): CreateAiAgentDto {
    const dto = new CreateAiAgentDto()
    const configurationDto = this.mapCreateConfigurationDto(formData)

    dto.name = formData.name
    dto.description = formData.description
    dto.provider = formData.provider
    dto.role = formData.role
    dto.configuration = configurationDto

    return dto
  }

  private mapCreateConfigurationDto(formData: AiAgentDto): CreateAiConfigurationDto {
    const configurationDto = new CreateAiConfigurationDto()

    configurationDto.model = formData.configuration.model
    configurationDto.prompt = formData.configuration.prompt
    configurationDto.stream = formData.configuration.stream
    configurationDto.temperature = formData.configuration.temperature

    return configurationDto
  }
}
