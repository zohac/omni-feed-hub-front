<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Dashboard</h1>
      </v-col>
    </v-row>

    <v-row>
      <DashboardStatCard v-for="card in cards" :key="card.title" v-bind="card" />
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
// pages/index.vue
const feedStore = useFeedStore()

await useAsyncData(async () => {
  await feedStore.fetchFeeds()
})

// Utilisation de storeToRefs pour rendre la liste réactive
const { feeds } = storeToRefs(feedStore)

const cards = computed(() => [
  {
    title: 'Total Feeds',
    value: feeds.value.length,
    icon: 'mdi-rss'
  }
])
</script>
