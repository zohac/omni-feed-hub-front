import type { AgentWorkflowStatus } from '~/types/enums/AgentWorkflowStatus'

export class AgentWorkflowDto {
  public name!: string
  public status!: AgentWorkflowStatus
}
