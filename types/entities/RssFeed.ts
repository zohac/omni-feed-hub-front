import type { Article } from '~/types/entities/Article'

export class RssFeed {
  constructor(
    public id: number,
    public title: string,
    public url: string,
    public description?: string,
    public collectionId?: number,
    public articles?: Article[]
  ) {}
}
