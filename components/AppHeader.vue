<template>
  <header class="fixed top-0 z-50 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
            @click="$emit('toggle-sidebar')"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Bars3Icon class="h-6 w-6 text-gray-500 dark:text-gray-400" />
        </button>
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-xl font-bold text-primary-600 dark:text-primary-400">Omni Feed Hub</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Bars3Icon } from '@heroicons/vue/24/outline'
</script>