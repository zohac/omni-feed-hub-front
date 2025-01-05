<template>
  <v-navigation-drawer v-model="isSidebarOpen" app :permanent="!isMobile" :temporary="isMobile">
    <v-list>
      <v-list-item
        v-for="(item, i) in navigation"
        :key="i"
        :value="item"
        color="primary"
        :to="item.path"
      >
        <template #prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useNavigation } from '~/composables/useNavigation'
import { useSidebar } from '~/composables/useSidebar'

const { navigation } = useNavigation()
const { isSidebarOpen } = useSidebar()
const isMobile = ref(false)

const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 960
  isSidebarOpen.value = !isMobile.value
}

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>
