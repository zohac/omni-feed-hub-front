<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
    <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
          v-for="card in cards"
          :key="card.title"
          v-bind="card"
      />
    </div>
  </div>
</template>

<script setup>
import { UsersIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/vue/24/outline'
import StatCard from "~/components/dashboard/StatCard.vue";

const cards = [
  { title: 'Total Users', value: '10,483', icon: UsersIcon },
  { title: 'Revenue', value: '$45,233', icon: CurrencyDollarIcon },
  { title: 'Conversion Rate', value: '24.57%', icon: ChartBarIcon }
]
</script>