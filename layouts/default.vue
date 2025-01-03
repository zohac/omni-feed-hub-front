<template>
  <div class="bg-gray-100 text-gray-800">
    <AppHeader @toggle-sidebar="toggleSidebar" />
    <AppSidebar :is-open="isSidebarOpen" />
    <main :class="['pt-16 transition-all duration-300', isSidebarOpen ? 'md:ml-64' : '']">
      <div class="p-4 md:p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "~/components/AppHeader";
import AppSidebar from "~/components/AppSidebar";
import { useSidebar } from "~/composables/useSidebar"

const { isSidebarOpen, toggleSidebar } = useSidebar()
</script>