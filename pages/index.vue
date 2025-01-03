<template>
  <div>
    <h1>Dashboard</h1>
    <div>
      <StatCard
          v-for="card in cards"
          :key="card.title"
          v-bind="card"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { UsersIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/vue/24/outline'
import StatCard from "~/components/dashboard/StatCard";

const cards = [
  { title: 'Total Users', value: '10,483', icon: UsersIcon },
  { title: 'Revenue', value: '$45,233', icon: CurrencyDollarIcon },
  { title: 'Conversion Rate', value: '24.57%', icon: ChartBarIcon }
]
</script>