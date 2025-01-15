export class AiConfigurationDto {
  model!: string
  prompt!: string
  stream!: boolean
  temperature?: number = 0.7 // Défaut à 0.7
}
