import type { AiAgent } from '~/types/entities/AiAgent'

export class AgentWorkflowStep {
  constructor(
    public id: number,
    public stepType: string,
    public order: number,
    public agent: AiAgent,
    public inputData: Record<string, any> = {}
  ) {}
}
