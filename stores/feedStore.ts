import { defineStore } from 'pinia'
import axios from 'axios'
import type { CreateRssFeedDto, UpdateRssFeedDto } from "~/types/rssFeed";
import  { RssFeed } from "~/types/rssFeed";


export const useFeedStore = defineStore('feed', {
  state: () => ({
    feeds: [],
    feed: null
  }),
  actions: {
    async fetchFeeds() {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/feeds`)
        this.feeds = data as RssFeed[]
      } catch (error) {
        console.error('Erreur lors de la récupération des flux RSS:', error)
      }
    },

    async fetchFeedById(id: number) {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.get(`${apiBase}/feeds/${id}`)
        this.feed = data
      } catch (error) {
        console.error('Flux introuvable:', error)
      }
    },

    async createFeed(feedData: CreateRssFeedDto) {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        const { data } = await axios.post(`${apiBase}/feeds`, feedData)
        this.feeds.push(data)
      } catch (error) {
        console.error('Erreur lors de la création du flux:', error)
      }
    },

    async updateFeed(id: number, updatedData: UpdateRssFeedDto) {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        await axios.put(`${apiBase}/feeds/${id}`, updatedData)
        await this.fetchFeeds()
      } catch (error) {
        console.error('Erreur lors de la mise à jour du flux:', error)
      }
    },

    async deleteFeed(id: number) {
      const apiBase = useRuntimeConfig().public.apiBase
      try {
        await axios.delete(`${apiBase}/feeds/${id}`)
        this.feeds = this.feeds.filter(feed => feed.id !== id)
      } catch (error) {
        console.error('Erreur lors de la suppression du flux:', error)
      }
    }
  }
})
