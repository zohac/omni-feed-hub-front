import type { Action } from '~/types/entities/Action'
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
    public configuration: AiConfiguration,
    public _actions: Action[] = []
  ) {}

  get actions(): Action[] {
    return this._actions
  }

  addAction(action: Action): void {
    this._actions.push(action)
  }

  removeAction(actionId: number): void {
    this._actions = this._actions.filter((a) => a.id !== actionId)
  }
}
