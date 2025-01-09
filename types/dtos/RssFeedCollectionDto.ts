export interface CreateRssFeedCollectionDto {
  name: string
  description?: string
}

export interface UpdateRssFeedCollectionDto {
  id?: number
  name?: string
  description?: string
}
