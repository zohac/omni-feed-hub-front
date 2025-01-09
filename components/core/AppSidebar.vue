<template>
  <v-navigation-drawer v-model="isSidebarOpen" :permanent="!isMobile" :temporary="isMobile" app>
    <v-list>
      <v-list-item
        v-for="(item, i) in navigation.home"
        :key="i"
        :to="item.path"
        :value="item"
        color="primary"
      >
        <template v-if="item.icon" #prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact">
      <v-list-group value="Tous mes Flux RSS">
        <template v-slot:activator="{ props }">
          <v-list-item title="Tous mes Flux RSS" v-bind="props"></v-list-item>
        </template>

        <v-list-item
          v-for="(item, i) in navigation.feedsMenu.value"
          :key="i"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.path"
          :value="item.title"
          color="primary"
        >
        </v-list-item>
      </v-list-group>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact">
      <v-list-group
        v-for="(feedCollection, i) in navigation.feedsCollectionMenu.value"
        :key="i"
        :value="feedCollection.title"
      >
        <template v-slot:activator="{ props }">
          <v-list-item :title="feedCollection.title" v-bind="props"></v-list-item>
        </template>

        <v-list-item
          v-for="(item, j) in feedCollection.subMenus"
          :key="j"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.path"
          :value="item.title"
          class="mx-3 feed-item"
          color="primary"
        >
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
// components/core/AppSidebar.vue
import { onMounted } from 'vue'
import { useNavigation } from '~/composables/useNavigation'
import { useSidebar } from '~/composables/useSidebar'
import { useFeedCollectionStore } from '~/stores/feedCollectionStore'
import { useFeedStore } from '~/stores/feedStore'

const feedStore = useFeedStore()
await feedStore.fetchFeeds()
const feedCollectionStore = useFeedCollectionStore()
await feedCollectionStore.fetchFeedsCollection()

const navigation = useNavigation()
const { isSidebarOpen } = useSidebar()
const isMobile = ref(false)

const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 960
  isSidebarOpen.value = !isMobile.value
}
console.log(navigation)
onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>

<style scoped>
.feed-item {
  border-radius: 5px !important; /* Arrondi plus prononcé */
}
</style>
