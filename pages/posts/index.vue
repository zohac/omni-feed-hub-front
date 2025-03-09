<!-- pages/posts.vue -->
<template>
  <v-container v-if="postStore.posts">
    <div>
      <h1>All Posts</h1>
    </div>

    <v-row justify="end">
      <v-col cols="12" md="4">
        <v-select
          v-model="sortOrder"
          :items="[
            { text: 'Du plus récent au plus ancien', value: 'desc' },
            { text: 'Du plus ancien au plus récent', value: 'asc' }
          ]"
          dense
          item-title="text"
          item-value="value"
          label="Trier par date de publication"
          variant="outlined"
        ></v-select>
      </v-col>
    </v-row>

    <transition-group name="fade" tag="div">
      <v-row v-for="post in sortedPosts" v-if="postStore.posts" :key="post.id">
        <v-col>
          <PostsCard :post="post" @open-post="openPostDetails" />
        </v-col>
      </v-row>
    </transition-group>
  </v-container>
  <v-container v-else type="error">
    <v-alert> Posts introuvable.</v-alert>
  </v-container>

  <!-- Drawer pour afficher les détails du post -->
  <v-navigation-drawer
    v-model="drawer"
    class="full-height-drawer"
    location="right"
    temporary
    width="900"
  >
    <div v-if="selectedPost">
      <PostsPost :post="selectedPost" @post-updated="updatePost" />
    </div>
    <v-container v-else>
      <v-alert type="info">Chargement du post...</v-alert>
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { PostService } from '~/services/PostService'
import { usePostStore } from '~/stores/postStore'
import type { Post } from '~/types/entities/Post'

const postStore = usePostStore()
const postService = new PostService(postStore)

// Drawer states
const drawer = ref(false)
const selectedPost = ref<Post | null>(null)
const sortOrder = ref('desc') // Valeur par défaut : du plus récent au plus ancien

await useAsyncData(async () => {
  await postStore.fetchPosts()
})

const sortedPosts = computed(() => {
  if (!postStore.posts) return []

  return [...postStore.posts].sort((a, b) => {
    const dateA = new Date(a.scheduledAt).getTime()
    const dateB = new Date(b.scheduledAt).getTime()

    return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA
  })
})

// Ouvre le drawer avec les détails du post
const openPostDetails = async (postId: number) => {
  const post = await postService.getPostById(postId)

  if (!post) return

  drawer.value = true
  selectedPost.value = await postService.getPostById(postId)
  await postService.getAll()
}

// Met à jour l'état du post via l'API
const updatePost = async (post: Post) => {
  selectedPost.value = await postService.getPostById(post.id)
  await postService.getAll()
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.full-height-drawer {
  position: fixed;
  height: 100%;
  top: 0;
}

.v-navigation-drawer__scrim {
  height: 100% !important;
  position: fixed;
}

.wrap-title {
  white-space: normal;
  word-wrap: break-word;
}
</style>
