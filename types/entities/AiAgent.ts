import type { AiConfiguration } from '~/types/entities/AiConfiguration'
import type { AiAgentProvider } from '~/types/enums/AiAgentProvider'
import type { AiAgentRole } from '~/types/enums/AiAgentRole'

export class AiAgent {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public provider: AiAgentProvider,
    public role: AiAgentRole,
    public configuration: AiConfiguration
  ) {}
}
