<template>
  <aside
      :class="[
      'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transition-transform duration-300',
      { '-translate-x-full': !isOpen }
    ]"
  >
    <NavItem />
  </aside>
</template>

<script setup lang="ts">
import NavItem from "~/layouts/NavItem";

defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})
</script>