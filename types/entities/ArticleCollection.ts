// types/entities/ArticleCollection.ts

import { Article } from '~/types/entities/Article'

export class ArticleCollection {
  constructor(
    public id: number,
    public name: string,
    public description?: string,
    public articles?: Article[]
  ) {}
}
