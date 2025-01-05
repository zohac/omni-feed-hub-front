export interface CreateRssFeedDto {
  title: string
  url: string
  description?: string
  collectionId?: number
}

export interface UpdateRssFeedDto {
  id?: number
  title?: string
  url?: string
  description?: string
  collectionId?: number
}
