<template>
  <NuxtLink
      :to="href"
      class="flex items-center p-2 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
  >
    <component
        :is="icon"
        class="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400"
    />
    <span class="ml-3">{{ name }}</span>
  </NuxtLink>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  href: {
    type: String,
    required: true
  },
  icon: {
    type: [Object, Function],
    required: true
  }
})
</script>