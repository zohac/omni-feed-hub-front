<template>
  <v-app-bar :elevation="2" color="primary" dark prominent>
    <template #prepend>
      <v-app-bar-nav-icon @click="toggleSidebar"></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>Omni Feed Hub</v-app-bar-title>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useSidebar } from '~/composables/useSidebar'

const { toggleSidebar } = useSidebar()
</script>
