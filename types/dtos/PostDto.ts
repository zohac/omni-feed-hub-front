// types/dtos/Post.ts

export interface CreatePostDto {
  title: string
  originalContent: string
  content: string
  recommendation: string
  explanation: string
  articlesId: number[]
  scheduledAt: string // ISO 8601 date-time string
}

export interface UpdatePostDto {
  title?: string
  originalContent?: string
  content?: string
  recommendation?: string
  explanation?: string
  articlesId?: number[]
  scheduledAt?: string // ISO 8601 date-time string
  published?: boolean
}
