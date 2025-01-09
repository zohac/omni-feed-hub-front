import type { RssFeed } from '~/types/entities/RssFeed'

export class RssFeedCollection {
  constructor(
    public id: number,
    public name: string,
    public description?: string,
    public feeds?: RssFeed[]
  ) {}
}
