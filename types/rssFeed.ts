export class RssFeed {
  id: number | undefined;
  title?: string;
  url?: string;
  description?: string;
  collectionId?: number;
}

export interface CreateRssFeedDto {
  title: string;
  url: string;
  description?: string;
  collectionId?: number;
}

export interface UpdateRssFeedDto {
  title?: string;
  url?: string;
  description?: string;
  collectionId?: number;
}
