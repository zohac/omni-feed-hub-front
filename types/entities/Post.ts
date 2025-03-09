// types/entities/Post.ts

import { Article } from './Article'
import { MediaAttachment } from './MediaAttachment'

export class Post {
  constructor(
    public id: number,
    public title: string,
    public content: string,
    public originalContent: string,
    public recommendation: string,
    public explanation: string,
    public createdAt: string | null, // ISO 8601 date-time string
    public scheduledAt: string | null, // ISO 8601 date-time string
    public publishedAt: string | null, // ISO 8601 date-time string
    public published: boolean,
    public attachments: MediaAttachment[],
    public articles?: Article[]
  ) {}
}
