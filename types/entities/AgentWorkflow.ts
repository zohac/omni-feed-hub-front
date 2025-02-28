import type { AgentWorkflowStep } from '~/types/entities/AgentWorkflowStep'
import type { AgentWorkflowStatus } from '~/types/enums/AgentWorkflowStatus'

export class AgentWorkflow {
  constructor(
    public id: number,
    public name: string,
    public status: AgentWorkflowStatus, // Ex: 'active', 'inactive'
    public steps: AgentWorkflowStep[] = []
  ) {}
}
