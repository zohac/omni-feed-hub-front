// types/dtos/AiConfigurationDto.ts

export class CreateAiConfigurationDto {
  model!: string
  prompt!: string
  stream!: boolean
  temperature?: number = 0.7 // Défaut à 0.7
}

export class UpdateAiConfigurationDto {
  id?: number
  model?: string
  prompt?: string
  stream?: boolean
  temperature?: number
}
