export const useSidebar = () => {
  const isSidebarOpen = useState('isSidebarOpen', () => true)

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  return {
    isSidebarOpen,
    toggleSidebar
  }
}