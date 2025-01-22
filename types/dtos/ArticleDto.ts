import { ArticleSourceType, type ArticleState } from '~/types/entities/ArticleState'
import { MediaAttachment } from '~/types/entities/MediaAttachment'
import { RssFeed } from '~/types/entities/RssFeed'

export class ArticleDto {
  constructor(
    public title?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public publicationAt?: Date,
    public sourceType?: ArticleSourceType,
    public state?: ArticleState,
    public feed?: RssFeed,
    public link?: string,
    public description?: string,
    public content?: string,
    public tags?: { id: string; label: string }[],
    public mediaAttachments?: MediaAttachment[],
    public metadata?: Record<string, string>
  ) {}
}
