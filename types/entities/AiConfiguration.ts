// src/domain/entities/ai-configuration.ts

export class AiConfiguration {
  constructor(
    public id: number | undefined,
    public model: string,
    public prompt: string,
    public stream: boolean,
    public temperature?: number
  ) {}
}
