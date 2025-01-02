<template>
  <aside
      :class="[
      'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300',
      { '-translate-x-full': !isOpen }
    ]"
  >
    <nav class="h-full px-3 py-4">
      <ul class="space-y-2">
        <li v-for="item in navigation" :key="item.name">
          <NavItem
              :name="item.name"
              :href="item.href"
              :icon="item.icon"
          />
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import NavItem from "~/layouts/NavItem.vue";
import {useNavigation} from "~/composables/useNavigation";

const { navigation } = useNavigation()

defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})
</script>