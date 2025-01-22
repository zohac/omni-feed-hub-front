import { useArticleStore } from '~/stores/articleStore'
import type { ArticleDto } from '~/types/dtos/ArticleDto'
import type { Article } from '~/types/entities/Article'
import type { ISnackMessage } from '~/types/interfaces/ISnackMessage'

type ArticleStore = ReturnType<typeof useArticleStore>

export class ArticleService {
  constructor(private readonly articleStore: ArticleStore) {}

  async getAll(): Promise<Article[]> {
    await this.articleStore.fetchArticles()

    return this.articleStore.articles
  }

  async getArticleById(id: number): Promise<Article | null> {
    await this.articleStore.fetchArticleById(id)

    return this.articleStore.article
  }

  async updateArticle(id: number, dto: ArticleDto): Promise<ISnackMessage> {
    return await this.articleStore.updateArticle(id, dto)
  }
}
