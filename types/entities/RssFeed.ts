export class RssFeed {
  id!: number
  title!: string
  url!: string
  description?: string
  collectionId?: number

  constructor(data: Partial<RssFeed>) {
    Object.assign(this, data)
  }
}
