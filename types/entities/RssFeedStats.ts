// /types/entities/rss-feed.stats.ts

import type { RssFeed } from '~/types/entities/RssFeed'

export class RssFeedStats {
  constructor(
    public id: number | undefined,
    public feed: RssFeed,
    public totalArticles: number,
    public unreadArticles: number,
    public favoriteArticles: number,
    public archivedArticles: number,
    public savedArticles: number
  ) {}
}
