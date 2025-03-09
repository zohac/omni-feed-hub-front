// composables/useNavigation.ts
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useFeedCollectionStore } from '~/stores/feedCollectionStore'
import { useFeedStore } from '~/stores/feedStore'
import { useStatsStore } from '~/stores/statsStore'

interface ItemMenu {
  title: string
  path: string
  icon?: string
  subMenus?: ItemSubMenu[]
  unreadCount?: number
}

interface ItemSubMenu {
  title: string
  path: string
  icon?: string
  unreadCount?: number
}

export const useNavigation = () => {
  const feedStore = useFeedStore()
  const { feeds } = storeToRefs(feedStore) // Réactivité des feeds
  const feedsMenu = ref<ItemMenu[]>([])

  const feedCollectionStore = useFeedCollectionStore()
  const { feedsCollection } = storeToRefs(feedCollectionStore)
  const feedsCollectionMenu = ref<ItemMenu[]>([])

  const statsStore = useStatsStore()
  const { stats } = storeToRefs(statsStore)

  // Observer les changements de feeds
  watch(
    feeds,
    (newFeeds) => {
      if (newFeeds.length > 0) {
        feedsMenu.value = newFeeds.map((feed) => {
          const feedStats = stats.value.find((stat) => stat.feed.id === feed.id)
          return {
            title: feed.title,
            path: `/feeds/${feed.id}`,
            unreadCount: feedStats ? feedStats.unreadArticles : 0
          }
        })
      }
    },
    { immediate: true }
  ) // Exécuter immédiatement lors du montage

  watch(
    feedsCollection,
    (newFeedsCollection) => {
      if (newFeedsCollection.length > 0) {
        feedsCollectionMenu.value = newFeedsCollection.map((feedCollection) => ({
          title: feedCollection.name,
          path: '',
          subMenus: feedCollection.feeds?.map((feed) => {
            const feedStats = stats.value.find((stat) => stat.feed.id === feed.id)
            return {
              title: feed.title,
              path: `/feeds/${feed.id}`,
              unreadCount: feedStats ? feedStats.unreadArticles : 0
            }
          })
        }))
      }
    },
    { immediate: true }
  )

  return {
    home: [
      { title: 'Dashboard', path: '/', icon: 'mdi-home-outline' },
      {
        title: 'All Articles',
        path: '/articles',
        icon: 'mdi-post-outline'
      },
      { title: 'All Posts', path: '/posts', icon: 'mdi-post-outline' }
    ],
    feedsMenu,
    feedsCollectionMenu
  }
}
