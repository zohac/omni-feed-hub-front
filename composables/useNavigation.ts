export const useNavigation = () => {
  const navigation = [
    { title: 'Dashboard', path: '/', icon: 'mdi-home' },
    { title: 'All Feeds', path: '/feeds', icon: 'mdi-rss' }
  ]

  return {
    navigation
  }
}
