<template>
  <v-app-bar :elevation="2" color="primary" dark prominent>
    <template #prepend>
      <v-app-bar-nav-icon
        icon="mdi-page-layout-sidebar-left"
        @click="toggleSidebar"
      ></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>Omni Feed Hub</v-app-bar-title>

    <v-row>
      <v-col>
        <!-- Bouton central pour ajouter un flux RSS -->
        <v-btn class="mx-auto" flat prepend-icon="mdi-rss" tag="a" to="/feeds" variant="outlined">
          <template #prepend>
            <v-icon></v-icon>
          </template>
          Ajouter un Flux RSS
        </v-btn>
      </v-col>
    </v-row>

    <template #append>
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in menuItems" :key="index" :to="item.to">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useSidebar } from '~/composables/useSidebar'

const { toggleSidebar } = useSidebar()

const menuItems = [
  { title: 'Gérer les Feeds', to: '/feeds' },
  { title: 'Gérer les Collections de Feeds', to: '/collections/feeds' },
  { title: "Gérer les Collections d'articles", to: '/collections/articles' },
  { title: 'Gérer les agents', to: '/agents' },
  { title: 'Gérer les workflows', to: '/workflows' },
  { title: 'Paramètres', to: '/settings' }
]
</script>
