<template>
  <div class="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow">
    <div class="p-5">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <component
              :is="icon"
              class="h-6 w-6 text-gray-400"
              aria-hidden="true"
          />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              {{ title }}
            </dt>
            <dd>
              <div class="text-lg font-medium text-gray-900 dark:text-white">
                {{ value }}
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  icon: {
    type: [Object, Function],  // Accepter Object et Function
    required: true
  }
})
</script>
