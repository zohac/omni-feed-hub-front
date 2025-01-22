<template>
  <v-navigation-drawer v-model="isSidebarOpen" :permanent="!isMobile" :temporary="isMobile" app>
    <!-- Menu statique -->
    <v-list>
      <v-list-item
        v-for="(item, i) in navigation.home"
        :key="i"
        :class="{ 'my-active': activeItem === item.path }"
        active-class="none"
        @click="navigateTo(item.path)"
      >
        <template v-if="item.icon" #prepend>
          <v-icon :icon="item.icon" />
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <div v-if="navigation.feedsMenu.value.length > 0">
      <v-divider />

      <!-- Groupe "Tous mes Flux RSS" -->
      <v-list density="compact">
        <v-list-group
          :value="openGroups.includes('allFeeds')"
          @click:toggle="toggleGroup('allFeeds')"
        >
          <template #activator="{ props }">
            <v-list-item title="Tous mes Flux RSS" v-bind="props" />
          </template>

          <v-list-item
            v-for="(item, i) in navigation.feedsMenu.value"
            :key="i"
            :class="{ 'my-active': activeItem === item.path }"
            :prepend-icon="item.icon"
            active-class="none"
            @click="navigateTo(item.path)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </div>

    <div>
      <v-divider />

      <!-- Gestion des collections -->
      <v-list density="compact">
        <v-list-group
          v-for="(feedCollection, i) in navigation.feedsCollectionMenu.value"
          :key="i"
          :value="`collection-${feedCollection.title}`"
        >
          <template v-slot:activator="{ props }">
            <v-list-item :title="feedCollection.title" v-bind="props" />
          </template>

          <v-list-item
            v-for="(item, j) in feedCollection.subMenus"
            :id="item.title + '-j' + j"
            :key="j"
            :class="{ 'my-active': activeItem === item.path }"
            :prepend-icon="item.icon"
            :to="item.path"
            class="mx-3 feed-item"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useRouter } from '#app' // Nuxt 3 : pour la navigation programmatique
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useNavigation } from '~/composables/useNavigation'
import { useSidebar } from '~/composables/useSidebar'
import { useFeedCollectionStore } from '~/stores/feedCollectionStore'
import { useFeedStore } from '~/stores/feedStore' /* Chargement des données */

/* Chargement des données */
const feedStore = useFeedStore()
await feedStore.fetchFeeds()
const feedCollectionStore = useFeedCollectionStore()
await feedCollectionStore.fetchFeedsCollection()

/* Récupération de la navigation */
const navigation = useNavigation()
const { isSidebarOpen } = useSidebar()

/* Responsive : vérifier mobile/desktop */
const isMobile = ref(false)
const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 960
  isSidebarOpen.value = !isMobile.value
}

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIsMobile)
})

/* Gestion manuelle de l'item “actif” */
const activeItem = ref<string | null>(null)

/* Utilisation du router de Nuxt 3 pour naviguer */
const router = useRouter()

function navigateTo(path: string) {
  activeItem.value = path
  router.push(path)
}

/* Gestion des groupes ouverts : ici on autorise plusieurs groupes en même temps */
const openGroups = ref<string[]>([])

/* Ouvrir/fermer un groupe manuellement */
function toggleGroup(groupName: string) {
  if (openGroups.value.includes(groupName)) {
    openGroups.value = openGroups.value.filter((g) => g !== groupName)
  } else {
    openGroups.value.push(groupName)
  }
}
</script>

<style scoped>
.my-active {
  background-color: rgba(
    var(--v-theme-primary),
    var(--v-activated-opacity)
  ) !important; /* Couleur primaire de Vuetify */
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: bold;
}

.feed-item {
  border-radius: 5px !important; /* Arrondi plus prononcé */
}
</style>
