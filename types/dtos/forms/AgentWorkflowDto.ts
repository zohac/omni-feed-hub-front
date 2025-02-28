import type { AgentWorkflowStatus } from '~/types/enums/AgentWorkflowStatus'

export class CreateAgentWorkflowFormDto {
  public name!: string
  public status!: AgentWorkflowStatus
}

export class UpdateAgentWorkflowFormDto {
  public id!: number
  public name?: string
  public status?: AgentWorkflowStatus
}
