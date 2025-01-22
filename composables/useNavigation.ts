// composables/UseNavigation.ts
import { useFeedCollectionStore } from '~/stores/feedCollectionStore'
import { useFeedStore } from '~/stores/feedStore'

interface ItemMenu {
  title: string
  path: string
  icon?: string
  subMenus?: ItemSubMenu[]
}

interface ItemSubMenu {
  title: string
  path: string
  icon?: string
}

export const useNavigation = () => {
  const feedStore = useFeedStore()
  const { feeds } = storeToRefs(feedStore) // Réactivité des feeds
  const feedsMenu = ref<ItemMenu[]>([])

  const feedCollectionStore = useFeedCollectionStore()
  const { feedsCollection } = storeToRefs(feedCollectionStore)
  const feedsCollectionMenu = ref<ItemMenu[]>([])

  // Observer les changements de feeds
  watch(
    feeds,
    (newFeeds) => {
      if (newFeeds.length > 0) {
        feedsMenu.value = newFeeds.map((feed) => ({
          title: feed.title,
          path: `/feeds/${feed.id}`
        }))
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
          subMenus: feedCollection.feeds?.map((feed) => ({
            title: feed.title,
            path: `/feeds/${feed.id}`
          }))
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
      }
    ],
    feedsMenu,
    feedsCollectionMenu
  }
}
