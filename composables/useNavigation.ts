export const useNavigation = () => {
  const navigation = [
    { label: 'Dashboard', to: '/', icon: 'i-heroicons-home' },
    { label: 'All Feeds', to: '/feeds', icon: 'i-heroicons-rss'},
  ]

  return {
    navigation
  }
}
