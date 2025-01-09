export enum ArticleSourceType {
  MANUAL = 'manual',
  RSS = 'rss'
}

export interface ArticleState {
  isRead: boolean
  isFavorite: boolean
  isArchived: boolean
  isSaved: boolean
}
