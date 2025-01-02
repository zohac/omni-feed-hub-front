import {
  HomeIcon,
  RssIcon,
} from '@heroicons/vue/24/outline'

export const useNavigation = () => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Feeds', href: '/feeds', icon: RssIcon },
  ]

  return {
    navigation
  }
}
