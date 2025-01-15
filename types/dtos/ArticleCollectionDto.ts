export interface CreateArticleCollectionDto {
  name: string
  description?: string
}

export interface UpdateArticleCollectionDto {
  id?: number
  name?: string
  description?: string
}
