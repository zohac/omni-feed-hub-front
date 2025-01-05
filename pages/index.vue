<template>
  <v-row>
    <v-col>
      <h1>Dashboard</h1>
    </v-col>
  </v-row>
  
  <v-row>
    <DashboardStatCard v-for="card in cards" :key="card.title" v-bind="card" />
  </v-row>
</template>

<script lang="ts" setup>
// import { useFeedStore } from '~/stores/feedStore'

const feedStore = useFeedStore()

await useAsyncData(async () => {
  await feedStore.fetchFeeds()
})

const cards = [{ title: 'Total Feeds', value: feedStore.feeds.length, icon: 'mdi-rss' }]
</script>
