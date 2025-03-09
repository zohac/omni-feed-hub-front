// stores/postStore.ts

import axios, { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import type { CreatePostDto, UpdatePostDto } from '~/types/dtos/PostDto'
import type { ApiErrorMessage } from '~/types/entities/ApiErrorMessage'
import { Post } from '~/types/entities/Post'
import type { ISnackMessage } from '~/types/interfaces/ISnackMessage'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [] as Post[],
    post: null as Post | null
  }),
  actions: {
    async fetchPosts(): Promise<void> {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/posts`)
        this.posts = data as Post[]
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    },

    async fetchPostById(id: number): Promise<void> {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/posts/${id}`)
        this.post = data as Post
      } catch (error) {
        console.error('Error fetching post by ID:', error)
      }
    },

    async createPost(dto: CreatePostDto): Promise<ISnackMessage> {
      const apiBase = useRuntimeConfig().public.apiBase

      try {
        const { data } = await axios.post(`${apiBase}/posts`, dto)

        this.posts.push(data)
        await this.fetchPosts()

        return { success: true, message: ['Post created successfully'] }
      } catch (error) {
        return this.handleApiError(error, 'Error creating post')
      }
    },

    async updatePost(id: number, dto: UpdatePostDto): Promise<ISnackMessage> {
      const apiBase = useRuntimeConfig().public.apiBase

      try {
        await axios.put(`${apiBase}/posts/${id}`, dto)
        await this.fetchPosts()
        await this.fetchPostById(id)
        return { success: true, message: ['Post updated successfully'] }
      } catch (error) {
        return this.handleApiError(error, 'Error updating post')
      }
    },

    async deletePost(id: number): Promise<ISnackMessage> {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        await axios.delete(`${apiBase}/posts/${id}`)
        this.posts = this.posts.filter((post) => post.id !== id)
        return { success: true, message: ['Post deleted successfully'] }
      } catch (error) {
        return this.handleApiError(error, 'Error deleting post')
      }
    },

    async publishPost(id: number): Promise<ISnackMessage> {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        await axios.patch(`${apiBase}/posts/${id}/publish`)
        await this.fetchPosts()
        await this.fetchPostById(id)
        return { success: true, message: ['Post published successfully'] }
      } catch (error) {
        return this.handleApiError(error, 'Error publishing post')
      }
    },

    // API error handling
    handleApiError(error: unknown, defaultMessage: string): ISnackMessage {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
        const data = axiosError.response?.data as ApiErrorMessage
        const message = data?.message || axiosError.message || defaultMessage
        // console.error(message);
        return { success: false, message }
      } else {
        // console.error(defaultMessage, error);
        return { success: false, message: [defaultMessage] }
      }
    }
  }
})
