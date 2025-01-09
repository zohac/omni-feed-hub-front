import type { ArticleState } from '~/types/entities/ArticleState'
import { ArticleSourceType } from '~/types/entities/ArticleState'
import { MediaAttachment } from '~/types/entities/MediaAttachment'
import { RssFeed } from '~/types/entities/RssFeed'

export class Article {
  constructor(
    public id: number,
    public title: string,
    public createdAt: Date,
    public updatedAt: Date,
    public publicationAt: Date,
    public sourceType: ArticleSourceType,
    public state: ArticleState,
    public feed?: RssFeed,
    public link?: string,
    public description?: string,
    public content?: string,
    public tags?: { id: string; label: string }[],
    public mediaAttachments?: MediaAttachment[],
    public metadata?: Record<string, string>
  ) {}

  // Méthode utilitaire pour construire un article à partir de la réponse de l'API
  static fromApiResponse(apiData: any): Article {
    return new Article(
      apiData.id,
      apiData.title,
      new Date(apiData.createdAt),
      new Date(apiData.updatedAt),
      new Date(apiData.publicationAt),
      apiData.sourceType as ArticleSourceType,
      apiData.state,
      apiData.feed,
      apiData.link,
      apiData.description,
      apiData.content,
      apiData.tags,
      apiData.mediaAttachments?.map((media: any) => MediaAttachment.fromApiResponse(media)),
      apiData.metadata
    )
  }
}
