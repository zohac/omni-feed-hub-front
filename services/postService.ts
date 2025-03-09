// services/PostService.ts

import { usePostStore } from '~/stores/postStore'
import type { CreatePostDto, UpdatePostDto } from '~/types/dtos/PostDto'
import type { Post } from '~/types/entities/Post'
import type { ISnackMessage } from '~/types/interfaces/ISnackMessage'

type PostStore = ReturnType<typeof usePostStore>

export class PostService {
  constructor(private readonly postStore: PostStore) {}

  async createPost(dto: CreatePostDto): Promise<ISnackMessage> {
    return await this.postStore.createPost(dto)
  }

  async updatePost(id: number, dto: UpdatePostDto): Promise<ISnackMessage> {
    return await this.postStore.updatePost(id, dto)
  }

  async deletePost(id: number): Promise<ISnackMessage> {
    return await this.postStore.deletePost(id)
  }

  async getPostById(id: number): Promise<Post | null> {
    await this.postStore.fetchPostById(id)
    return this.postStore.post
  }

  async getAll(): Promise<Post[]> {
    await this.postStore.fetchPosts()
    return this.postStore.posts
  }

  async publishPost(id: number): Promise<ISnackMessage> {
    return await this.postStore.publishPost(id)
  }
}
