import { useArticleStore } from '~/stores/articleStore'
import type { ArticleDto } from '~/types/dtos/ArticleDto'
import type { Article } from '~/types/entities/Article'
import type { ISnackMessage } from '~/types/interfaces/ISnackMessage'

type ArticleStore = ReturnType<typeof useArticleStore>

export class ArticleService {
  constructor(private readonly articleStore: ArticleStore) {}

  async getAll(params?: {
    tag?: string
    limit?: number
    sortPublicationAt?: 'ASC' | 'DESC'
    page?: number
  }): Promise<{
    articles: Article[]
    total: number
    totalPages: number
  }> {
    await this.articleStore.fetchArticles(params)

    return {
      articles: this.articleStore.articles,
      total: this.articleStore.total,
      totalPages: this.articleStore.totalPages
    }
  }

  async getArticleById(id: number): Promise<Article | null> {
    await this.articleStore.fetchArticleById(id)

    return this.articleStore.article
  }

  async updateArticle(id: number, dto: ArticleDto): Promise<ISnackMessage> {
    return await this.articleStore.updateArticle(id, dto)
  }
}
