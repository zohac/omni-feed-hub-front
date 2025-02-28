// services/workflowService.ts

import type { useWorkflowStore } from '~/stores/worflowStore'
import { AgentWorkflowDto } from '~/types/dtos/AgentWorkflowDto'
import type { CreateAgentWorkflowFormDto } from '~/types/dtos/forms/AgentWorkflowDto'
import { UpdateAgentWorkflowFormDto } from '~/types/dtos/forms/AgentWorkflowDto'
import type { AgentWorkflow } from '~/types/entities/AgentWorkflow'
import type { ISnackMessage } from '~/types/interfaces/ISnackMessage'

type WorkflowStore = ReturnType<typeof useWorkflowStore>

export class WorkflowService {
  constructor(private readonly workflowStore: WorkflowStore) {}

  async getAll(): Promise<AgentWorkflow[]> {
    await this.workflowStore.fetchWorkflows()

    return this.workflowStore.workflows
  }

  async getWorkflowById(id: number): Promise<AgentWorkflow | null> {
    await this.workflowStore.fetchWorkflowById(id)

    return this.workflowStore.workflow
  }

  async createWorkflow(formValues: CreateAgentWorkflowFormDto): Promise<ISnackMessage> {
    const dto = {
      name: formValues.name,
      status: formValues.status
    } as AgentWorkflowDto

    return await this.workflowStore.createWorkflow(dto)
  }

  async updateWorkflow(workflow: UpdateAgentWorkflowFormDto): Promise<ISnackMessage> {
    const dto = {
      name: workflow.name,
      status: workflow.status
    } as AgentWorkflowDto

    return await this.workflowStore.updateWorkflow(workflow.id, dto)
  }

  async deleteWorkflow(id: number): Promise<ISnackMessage> {
    return await this.workflowStore.deleteWorkflow(id)
  }
}
