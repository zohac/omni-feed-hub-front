// services/rssFeedService.ts

import Parser from 'rss-parser'
import { useFeedStore } from '~/stores/feedStore'
import type { CreateRssFeedDto, UpdateRssFeedDto } from '~/types/dtos/RssFeedDto'
import type { RssFeed } from '~/types/entities/RssFeed'
import { RssFeedInfos } from '~/types/entities/RssFeedInfos'
import type { ISnackMessage } from '~/types/interfaces/ISnackMessage'

type FeedStore = ReturnType<typeof useFeedStore>

export class RssFeedService {
  private readonly parser = new Parser()

  constructor(private readonly feedStore: FeedStore) {}

  async parseURL(url: string): Promise<RssFeedInfos | null> {
    const response = await this.feedStore.getFeedInfos({ url })
    if (this.isRssFeedInfosDto(response)) {
      return response
    }
    console.error(response)

    return null
  }

  isRssFeedInfosDto(dto: RssFeedInfos | ISnackMessage): dto is RssFeedInfos {
    return 'link' in dto
  }

  async createFeed(url: string, rssFeedInfos: RssFeedInfos): Promise<ISnackMessage> {
    const dto: CreateRssFeedDto = {
      title: rssFeedInfos.title ?? '',
      url: url,
      description: rssFeedInfos.description
    }

    return await this.feedStore.createFeed(dto)
  }

  async updateFeed(values: UpdateRssFeedDto): Promise<ISnackMessage> {
    const dto = {
      title: values.title,
      url: values.url,
      description: values.description,
      collectionId: values.collectionId
    }

    return await this.feedStore.updateFeed(values.id!, dto)
  }

  async deleteFeed(id: number): Promise<ISnackMessage> {
    return await this.feedStore.deleteFeed(id)
  }

  async getFeedById(id: number): Promise<RssFeed | null> {
    await this.feedStore.fetchFeedById(id)

    return this.feedStore.feed
  }

  async getAll(): Promise<RssFeed[]> {
    await this.feedStore.fetchFeeds()

    return this.feedStore.feeds
  }
}
